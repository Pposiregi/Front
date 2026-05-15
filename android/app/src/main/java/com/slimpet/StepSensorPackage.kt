package com.slimpet

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class StepSensorPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext) =
        listOf(StepSensorModule(context))

    override fun createViewManagers(context: ReactApplicationContext) =
        emptyList<ViewManager<*, *>>()
}
