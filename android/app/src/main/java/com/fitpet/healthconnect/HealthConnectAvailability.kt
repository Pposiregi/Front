package com.fitpet.healthconnect

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.health.connect.client.HealthConnectClient

/**
 * Health Connect 설치/업데이트 상태를 네이티브에서 직접 확인하고
 * 필요 시 Play Store로 리디렉션한다.
 */
object HealthConnectAvailability {
  private const val PROVIDER_PACKAGE_NAME = "com.google.android.apps.healthdata"
  private const val TAG = "HealthConnectAvailability"

  fun ensureAvailable(activity: Activity): Boolean {
    val status = HealthConnectClient.getSdkStatus(activity, PROVIDER_PACKAGE_NAME)

    if (status == HealthConnectClient.SDK_UNAVAILABLE) {
      Log.w(TAG, "Health Connect SDK unavailable on this device.")
      return false
    }

    if (status == HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
      Log.i(TAG, "Health Connect provider update required. Redirecting to Play Store.")
      val uriString =
        "market://details?id=$PROVIDER_PACKAGE_NAME&url=healthconnect%3A%2F%2Fonboarding"
      val intent = Intent(Intent.ACTION_VIEW).apply {
        setPackage("com.android.vending")
        data = Uri.parse(uriString)
        putExtra("overlay", true)
        putExtra("callerId", activity.packageName)
      }
      runCatching { activity.startActivity(intent) }
        .onFailure { Log.w(TAG, "Failed to launch Play Store for Health Connect.", it) }
      return false
    }

    // SDK_AVAILABLE
    return true
  }
}
