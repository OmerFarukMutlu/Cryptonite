if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/faruk/.gradle/caches/8.14.3/transforms/c5d00dc535002a1a83f36cd786a0266e/transformed/hermes-android-0.81.0-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/faruk/.gradle/caches/8.14.3/transforms/c5d00dc535002a1a83f36cd786a0266e/transformed/hermes-android-0.81.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

