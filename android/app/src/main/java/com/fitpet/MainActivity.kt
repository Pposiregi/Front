package com.fitpet

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {
  companion object {
    private const val REQUEST_POST_NOTIFICATIONS = 1011
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)
    HealthConnectPermissionDelegate.setPermissionDelegate(this) // 2025.10.26 MAN]Health Connect 권한 위임 설정
    requestNotificationPermissionIfNeeded()
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "FitPet"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  private fun requestNotificationPermissionIfNeeded() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val permission = Manifest.permission.POST_NOTIFICATIONS
      val alreadyGranted =
          ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED
      if (!alreadyGranted) {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(permission),
            REQUEST_POST_NOTIFICATIONS
        )
      }
    }
  }
}
