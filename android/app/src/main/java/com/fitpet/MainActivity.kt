package com.fitpet

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.fitpet.healthconnect.HealthConnectAvailability
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate
import kotlinx.coroutines.launch
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {
  companion object {
    private const val REQUEST_POST_NOTIFICATIONS = 1011
  }

  /**
   * Health Connect에서 사용할 권한 목록
   */
  private val healthPermissions = setOf(
    HealthPermission.getReadPermission(HeartRateRecord::class),
    HealthPermission.getWritePermission(HeartRateRecord::class),
    HealthPermission.getReadPermission(StepsRecord::class),
    HealthPermission.getWritePermission(StepsRecord::class),
  )

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)

    /**
     * Health Connect 사용 준비
     * - SDK 설치/업데이트 상태 확인 및 필요 시 Play Store 리디렉션
     * - Health Connect 권한 위임 설정
     * - 권한 확인 및 요청
     * - 2025.12.16. KGYURY 
     */
    HealthConnectAvailability.ensureAvailable(this) // SDK 상태 확인 및 필요 시 스토어 리디렉션
    HealthConnectPermissionDelegate.setPermissionDelegate(this) // 2025.10.26 MAN]Health Connect 권한 위임 설정
    checkHealthPermissions()
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


  /**
   * 알림 권한 요청 (Android 13+)
   */
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



  /**
   * Health Connect 권한 요청 결과 처리기
   */
  private val requestHealthPermissions = registerForActivityResult(
    PermissionController.createRequestPermissionResultContract()
  ) { granted ->
    val allGranted = granted.containsAll(healthPermissions)
    if (!allGranted) {
      // 필수 권한이 없을 때 추가 안내가 필요하면 여기서 처리
    }
  }


  /**
   * Health Connect 권한 확인 및 요청
   */
  private fun checkHealthPermissions() {
    if (!HealthConnectAvailability.ensureAvailable(this)) return
    val client = HealthConnectClient.getOrCreate(this)
    lifecycleScope.launch {
      // 현재 부여된 권한 확인
      val granted = client.permissionController.getGrantedPermissions()
      if (!granted.containsAll(healthPermissions)) {
        // 권한이 모두 부여되지 않음 - 권한 요청
        requestHealthPermissions.launch(healthPermissions)
      }
    }
  }
}
