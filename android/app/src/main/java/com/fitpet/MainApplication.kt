package com.fitpet

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import android.os.Build
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessaging

private const val FCM_TAG = "FitpetFCM"
private const val FCM_CHANNEL_ID = "fitpet_fcm_default"
private const val FCM_CHANNEL_NAME = "Fitpet Notifications"
private const val FCM_CHANNEL_DESC = "Default channel for Fitpet FCM"
private const val RUNNING_CHANNEL_ID = "running-tracker"
private const val RUNNING_CHANNEL_NAME = "러닝 트래킹"
private const val RUNNING_CHANNEL_DESC = "러닝 진행 중 포그라운드 서비스 알림"

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

    /**
     * 앱 시작 시, FCM 토큰을 가져오고  푸시 알림 권한을 요청합니다.
     * - 권한이 부여되지 않은 경우, 설정 화면으로 이동합니다.
     */
  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    createNotificationChannels()
    requestNotificationPermission()
    FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
      if (!task.isSuccessful) {
        Log.w(FCM_TAG, ">>> [FCM] TOKEN 가져오기 실패", task.exception)
        return@addOnCompleteListener
      }
      val token = task.result
      Log.d(FCM_TAG, ">>> [FCM] TOKEN: $token")
    }
  }

  private fun createNotificationChannels() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val fcmChannel = NotificationChannel(
        FCM_CHANNEL_ID,
        FCM_CHANNEL_NAME,
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = FCM_CHANNEL_DESC
      }
      val runningChannel = NotificationChannel(
        RUNNING_CHANNEL_ID,
        RUNNING_CHANNEL_NAME,
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        description = RUNNING_CHANNEL_DESC
        setSound(null, null)
        enableVibration(false)
      }
      val notificationManager =
        getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.createNotificationChannel(fcmChannel)
      notificationManager.createNotificationChannel(runningChannel)
    }
  }

  private fun requestNotificationPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val notificationManager = NotificationManagerCompat.from(this)
      if (!notificationManager.areNotificationsEnabled()) {
        val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
          putExtra(Settings.EXTRA_APP_PACKAGE, packageName)
        }
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
      }
    }
  }
}
