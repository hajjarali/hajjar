// The platform's part of the build (group, Java version, encoding, the platform) is .cx/platform.gradle, which the
// build machine's init script applies to every project after this script.
plugins {
    java
}

// The version a build uses; a publish sets its own through the build machine, and the project is never edited for it
version = "1.0-SNAPSHOT"

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.11.4"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
}
