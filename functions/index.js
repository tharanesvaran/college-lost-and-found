/**
 * Firebase Cloud Functions for MCET College Lost & Found System
 *
 * Features:
 * 1. weeklyUnclaimedDigest: Scheduled Cloud Function that emails all students
 *    a single consolidated summary of new unclaimed items from the past 7 days.
 * 2. checkItemExpiry: Daily scheduled Cloud Function that checks the holding
 *    period (30-60 days, default 45) and flags unclaimed items as 'Expired'.
 * 3. onLostReportCreated: Firestore trigger that compares incoming lost reports
 *    against found items (category, keywords, location, date) and alerts admin & student.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Optional SMTP email transporter (configure via functions:config:set or environment variables)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || functions.config().email?.user || "lostandfound@mcet.in",
    pass: process.env.EMAIL_PASS || functions.config().email?.pass || "app_specific_password_here"
  }
});

/**
 * 1. WEEKLY BATCH NOTIFICATION
 * Scheduled to run every Monday at 09:00 AM IST (Asia/Kolkata).
 * Emails all students one summary of new unclaimed items, instead of individual messages.
 */
exports.weeklyUnclaimedDigest = functions.pubsub
  .schedule("0 9 * * 1")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    console.log("Starting weekly unclaimed items batch digest execution...");

    try {
      // 1. Fetch holding period settings
      const settingsDoc = await db.collection("appSettings").doc("config").get();
      const settings = settingsDoc.exists ? settingsDoc.data() : { holdingPeriodDays: 45 };

      // 2. Fetch all items logged in the past 7 days with status 'Unclaimed' and not sensitive
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const itemsSnapshot = await db
        .collection("items")
        .where("status", "==", "Unclaimed")
        .where("isSensitive", "==", false)
        .where("createdAt", ">=", sevenDaysAgo.toISOString())
        .get();

      if (itemsSnapshot.empty) {
        console.log("No new unclaimed public items logged in the past 7 days. Digest skipped.");
        return null;
      }

      const recentItems = [];
      itemsSnapshot.forEach((doc) => {
        const data = doc.data();
        recentItems.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          location: data.locationName,
          dateFound: data.dateFound,
          storage: data.storageNumber
        });
      });

      console.log(`Found ${recentItems.length} new items for the weekly digest.`);

      // 3. Create an in-app broadcast notification in Firestore
      const broadcastNotif = {
        recipientUid: "all",
        isBroadcast: true,
        title: `📢 Weekly Lost & Found Digest (${recentItems.length} New Unclaimed Items)`,
        message: `A summary of ${recentItems.length} newly found belongings logged at the Admin Office this week is now available. Review them before the ${settings.holdingPeriodDays}-day holding period ends.`,
        itemCount: recentItems.length,
        itemsSummary: recentItems.map(i => `${i.title} (${i.category}) found at ${i.location}`).join(", "),
        type: "weekly_digest",
        read: false,
        createdAt: new Date().toISOString()
      };

      await db.collection("notifications").add(broadcastNotif);

      // 4. Send email summary to all registered student emails
      const studentsSnapshot = await db
        .collection("users")
        .where("role", "==", "student")
        .where("profileComplete", "==", true)
        .get();

      const recipientEmails = [];
      studentsSnapshot.forEach((doc) => {
        const student = doc.data();
        if (student.email && !recipientEmails.includes(student.email)) {
          recipientEmails.push(student.email);
        }
      });

      if (recipientEmails.length === 0) {
        console.log("No student email recipients found.");
        return null;
      }

      // Generate HTML email content
      const itemsHtml = recentItems
        .map(
          (item) => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px; font-weight: bold; color: #1e293b;">${item.title}</td>
            <td style="padding: 10px; color: #475569;">${item.category}</td>
            <td style="padding: 10px; color: #475569;">${item.location}</td>
            <td style="padding: 10px; color: #64748b;">${item.dateFound}</td>
          </tr>`
        )
        .join("");

      const mailOptions = {
        from: '"MCET Property Recovery Portal" <lostandfound@mcet.in>',
        bcc: recipientEmails, // Use BCC to protect student email privacy
        subject: `Weekly Property Recovery Digest - ${recentItems.length} New Items at MCET Admin Office`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
            <div style="background: #0f172a; color: #ffffff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #fbbf24;">Dr. Mahalingam College of Engineering & Technology</h2>
              <p style="margin: 5px 0 0; font-size: 14px; color: #94a3b8;">Campus Property Recovery Cell — Weekly Digest</p>
            </div>
            <div style="padding: 24px;">
              <p>Dear MCET Students,</p>
              <p>Here is your weekly summary of belongings handed in to the College Admin Office during the past 7 days. If any item belongs to you, log in to the portal to verify ownership and arrange collection.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <thead>
                  <tr style="background: #f1f5f9; text-align: left;">
                    <th style="padding: 10px;">Item</th>
                    <th style="padding: 10px;">Category</th>
                    <th style="padding: 10px;">Location Found</th>
                    <th style="padding: 10px;">Date Found</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0; font-size: 13px;">
                <strong>Collection Note:</strong> Please bring your original College ID Card to the Admin Office (Ground Floor, Room 102) between 9:00 AM - 4:30 PM for verification.
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center;">
                Holding Period: Items unclaimed after ${settings.holdingPeriodDays} days are transferred to student welfare funds or donated.
              </p>
            </div>
          </div>`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Weekly digest email sent to ${recipientEmails.length} students.`);
      } catch (err) {
        console.warn("Email sending failed or SMTP not configured (in-app notification was still created):", err.message);
      }

      return { success: true, count: recentItems.length, recipients: recipientEmails.length };
    } catch (error) {
      console.error("Error in weeklyUnclaimedDigest function:", error);
      throw error;
    }
  });

/**
 * 2. AUTO-EXPIRY CHECKER
 * Runs daily at midnight IST. Checks items that have exceeded the holding period
 * (default 45 days, configurable 30-60 days) and marks them as 'Expired'.
 */
exports.checkItemExpiry = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    console.log("Checking for items exceeding the campus holding period...");

    try {
      // 1. Fetch holding period days (default 45)
      const settingsDoc = await db.collection("appSettings").doc("config").get();
      const holdingPeriodDays = settingsDoc.exists && settingsDoc.data().holdingPeriodDays
        ? settingsDoc.data().holdingPeriodDays
        : 45;

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - holdingPeriodDays);
      const thresholdDateStr = thresholdDate.toISOString().split("T")[0]; // YYYY-MM-DD

      // 2. Query items with status 'Unclaimed' found before thresholdDate
      const snapshot = await db
        .collection("items")
        .where("status", "==", "Unclaimed")
        .where("dateFound", "<=", thresholdDateStr)
        .get();

      if (snapshot.empty) {
        console.log("No items have exceeded the holding period today.");
        return null;
      }

      const batch = db.batch();
      let count = 0;

      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          status: "Expired",
          expiredAt: new Date().toISOString(),
          expiryFlaggedDate: thresholdDateStr
        });
        count++;
      });

      await batch.commit();
      console.log(`Successfully flagged ${count} items as 'Expired' for admin resolution.`);
      return { success: true, expiredCount: count };
    } catch (error) {
      console.error("Error in checkItemExpiry function:", error);
      throw error;
    }
  });

/**
 * 3. AUTO-MATCHING TRIGGER
 * Firestore onCreate trigger on lostReports collection.
 * Compares new student lost reports against existing found items in the system.
 */
exports.onLostReportCreated = functions.firestore
  .document("lostReports/{reportId}")
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const reportId = context.params.reportId;

    try {
      // Query unclaimed items in the same category
      const itemsSnapshot = await db
        .collection("items")
        .where("status", "==", "Unclaimed")
        .where("category", "==", report.category)
        .get();

      if (itemsSnapshot.empty) return null;

      const reportWords = (report.description || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      let bestMatch = null;
      let highestScore = 0;

      itemsSnapshot.forEach((doc) => {
        const item = doc.data();
        let score = 35; // Category matched (35 points)

        // Keyword similarity in description (up to 35 points)
        const itemText = `${item.title} ${item.description}`.toLowerCase();
        let matchedWords = 0;
        reportWords.forEach((word) => {
          if (itemText.includes(word)) matchedWords++;
        });

        if (reportWords.length > 0) {
          score += Math.min(35, Math.round((matchedWords / reportWords.length) * 35));
        }

        // Location proximity / landmark matching (15 points)
        if (
          report.locationName &&
          item.locationName &&
          (report.locationName.toLowerCase().includes(item.locationName.toLowerCase()) ||
            item.locationName.toLowerCase().includes(report.locationName.toLowerCase()))
        ) {
          score += 15;
        }

        // Date proximity within 5 days (15 points)
        if (report.dateLost && item.dateFound) {
          const diffDays = Math.abs(
            (new Date(report.dateLost).getTime() - new Date(item.dateFound).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (diffDays <= 3) score += 15;
          else if (diffDays <= 7) score += 10;
        }

        if (score > highestScore && score >= 55) {
          highestScore = score;
          bestMatch = { id: doc.id, ...item, score };
        }
      });

      if (bestMatch && highestScore >= 55) {
        console.log(`Auto-match found for Lost Report ${reportId} with Item ${bestMatch.id} (Score: ${highestScore}%)`);

        // Notify the student
        await db.collection("notifications").add({
          recipientUid: report.studentUid,
          title: `⚡ Likely Match Found for Your Lost ${report.category}`,
          message: `A found item "${bestMatch.title}" at ${bestMatch.locationName} has an auto-match confidence of ${highestScore}%. Check browse items to submit a claim!`,
          type: "match_alert",
          matchScore: highestScore,
          matchedItemId: bestMatch.id,
          read: false,
          createdAt: new Date().toISOString()
        });

        // Update the lost report with match details
        await snap.ref.update({
          matchedItemId: bestMatch.id,
          matchConfidence: highestScore,
          matchedAt: new Date().toISOString()
        });
      }

      return null;
    } catch (err) {
      console.error("Error in onLostReportCreated:", err);
      return null;
    }
  });
