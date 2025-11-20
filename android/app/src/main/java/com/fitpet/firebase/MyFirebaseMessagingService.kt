package com.fitpet.firebase

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

private const val TAG = "MyFirebaseMessaging"
private const val CHANNEL_ID = "fitpet_fcm_default"

/**
 * Handles Firebase Cloud Messaging callbacks for Fitpet.
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

    createNotificationChannel()

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
      showNotification(it.title ?: "FitPet", it.body ?: "")
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
    val builder = NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(android.R.drawable.ic_dialog_info)
        .setContentTitle(title)
        .setContentText(body)
        .setAutoCancel(true)
        .setPriority(NotificationCompat.PRIORITY_HIGH)

    with(NotificationManagerCompat.from(this)) {
      notify(System.currentTimeMillis().toInt(), builder.build())
    }
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val name = "Fitpet Notifications"
      val descriptionText = "Default channel for Fitpet FCM"
      val importance = NotificationManager.IMPORTANCE_HIGH
      val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
        description = descriptionText
      }
      val notificationManager: NotificationManager =
          getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.createNotificationChannel(channel)
    }
  }
}
