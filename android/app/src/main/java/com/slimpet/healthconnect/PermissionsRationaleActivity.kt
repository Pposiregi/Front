package com.slimpet.healthconnect

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class PermissionsRationaleActivity: AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val webView = WebView(this)
    webView.webViewClient = object : WebViewClient() {
      override fun shouldOverrideUrlLoading(view: WebView?, request: android.webkit.WebResourceRequest?): Boolean =
        false
    }

    val html = """
      <html><body style="padding:16px;font-size:16px;">
      <h2>Health Connect 권한 안내</h2>
      <p>Fitpet은 오늘 걸음 수를 백그라운드에서 동기화하기 위해 아래 권한이 필요합니다.</p>
      <ul>
        <li>걸음 수 읽기: 오늘 걸음 집계</li>
        <li>백그라운드 건강 데이터 읽기: 앱이 닫혀도 걸음 동기화 유지</li>
      </ul>
      <p>수집된 데이터는 기기 내 동기화 및 서버 전송(동기화 목적)에만 사용되며, 정책에 따라 보관·삭제됩니다. 권한을 거부하면 걸음 동기화 기능을 사용할 수 없습니다.</p>
      <p><a href="https://TODO.com/privacy">개인정보처리방침 보기</a></p>
      </body></html>
    """.trimIndent()

    webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null)

    setContentView(webView)
  }
}
