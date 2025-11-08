package com.fitpet.healthconnect

import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.ComponentActivity
import com.fitpet.MainActivity

/**
 * Health Connect 온보딩 요구사항을 충족하기 위한 단순 안내 액티비티.
 * Health Connect 앱에서 Fitpet을 연결하려고 할 때 호출되며,
 * 사용자에게 앱을 열도록 안내하고 곧바로 메인 액티비티를 실행한다.
 */
class OnboardingActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val container = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
      setPadding(64, 64, 64, 64)
    }

    val title = TextView(this).apply {
      text = "Health Connect 연동 안내"
      textSize = 20f
      gravity = Gravity.CENTER
    }

    val description = TextView(this).apply {
      text =
        "Fitpet 앱을 열어 Health Connect 연동을 완료해주세요. 앱에서 세부 안내를 이어갈게요."
      textSize = 16f
      gravity = Gravity.CENTER
      setPadding(0, 24, 0, 24)
    }

    val openAppButton = Button(this).apply {
      text = "Fitpet 앱 열기"
      setOnClickListener {
        val intent = Intent(this@OnboardingActivity, MainActivity::class.java).apply {
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        startActivity(intent)
        finish()
      }
    }

    container.addView(title)
    container.addView(description)
    container.addView(openAppButton)

    setContentView(container)
  }
}
