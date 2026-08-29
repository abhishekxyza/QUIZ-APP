# Convert Web Quiz to Android WebView App

This plan will transform the current web-based quiz project into a fully functional Android project that can be built and run directly from Android Studio.

## User Review Required

> [!IMPORTANT]
> The project structure will change significantly to follow the standard Android Gradle layout. The original web files will be moved to the `assets` directory.

## Proposed Changes

### Android Project Configuration

#### [NEW] [settings.gradle](file:///C:/Users/as705/StudioProjects/QUIZ-APP/settings.gradle)
Define the project name and include the `:app` module.

#### [NEW] [build.gradle](file:///C:/Users/as705/StudioProjects/QUIZ-APP/build.gradle)
Project-level build file with necessary plugins.

#### [NEW] [app/build.gradle](file:///C:/Users/as705/StudioProjects/QUIZ-APP/app/build.gradle)
Module-level build file with Android configurations and dependencies.

### App Source Code

#### [NEW] [AndroidManifest.xml](file:///C:/Users/as705/StudioProjects/QUIZ-APP/app/src/main/AndroidManifest.xml)
Declare the `MainActivity` and required permissions (Internet, though assets are local).

#### [NEW] [MainActivity.kt](file:///C:/Users/as705/StudioProjects/QUIZ-APP/app/src/main/java/com/example/quizapp/MainActivity.kt)
Kotlin activity that hosts a `WebView` to load the quiz from local assets.

### Assets Management

#### [MOVE] `index.html`, `app.js`, `styles.css`
Move these files to `app/src/main/assets/` so they can be loaded by the `WebView`.

## Verification Plan

### Automated Tests
- Build the project using `./gradlew assembleDebug` to ensure all configurations are correct.

### Manual Verification
- Run the app on the connected Samsung Galaxy A9 from Android Studio.
- Verify that the quiz UI loads correctly and is interactive.
