package com.slimpet.firebase

import android.app.PendingIntent
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.slimpet.MainActivity
import com.slimpet.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

private const val TAG = "MyFirebaseMessaging"
private const val CHANNEL_ID = "slimpet_fcm_default"

/**
 * Handles Firebase Cloud Messaging callbacks for Slimpet.
 * - Logs refreshed registration tokens via onNewToken.
 * - Prints incoming message payloads for debugging.
 */
class MyFirebaseMessagingService : FirebaseMessagingService() {

  override fun onNewToken(token: String) {
    super.onNewToken(token)
    Log.d(TAG, "Refreshed token: $token")
    sendRegistrationToServer(token)
  }

  private fun sendRegistrationToServer(token: String) {
    // TODO: Integrate with real backend when available.
    Log.d(TAG, "sendRegistrationToServer(token)")
  }

  override fun onMessageReceived(remoteMessage: RemoteMessage) {
    super.onMessageReceived(remoteMessage)
    Log.d(TAG, "From: ${remoteMessage.from}")

    if (remoteMessage.data.isNotEmpty()) {
      Log.d(TAG, "Message data payload: ${remoteMessage.data}")
      if (needsLongRunningJob(remoteMessage)) {
        scheduleJob()
      } else {
        handleNow(remoteMessage)
      }
    }

    remoteMessage.notification?.let {
      Log.d(TAG, "Message Notification Body: ${it.body}")
      showNotification(it.title ?: "Slimpet", it.body ?: "")
    }
  }

  private fun needsLongRunningJob(remoteMessage: RemoteMessage): Boolean {
    // Customize the condition for long-running jobs as needed.
    return false
  }

  private fun scheduleJob() {
    Log.d(TAG, "scheduleJob() placeholder invoked")
  }

  private fun handleNow(remoteMessage: RemoteMessage) {
    Log.d(TAG, "handleNow() processing completed")
  }

  private fun showNotification(title: String, body: String) {
    val intent = Intent(this, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
    }
    val pendingIntent = PendingIntent.getActivity(
      this,
      0,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    with(NotificationManagerCompat.from(this)) {
      if (!areNotificationsEnabled()) {
        Log.w(TAG, "Notifications are disabled, cannot show notification")
        return
      }

      val builder = NotificationCompat.Builder(this@MyFirebaseMessagingService, CHANNEL_ID)
          .setSmallIcon(R.drawable.ic_notification)
          .setContentTitle(title)
          .setContentText(body)
          .setContentIntent(pendingIntent)
          .setAutoCancel(true)
          .setPriority(NotificationCompat.PRIORITY_HIGH)

      notify(System.currentTimeMillis().toInt(), builder.build())
    }
  }
}
