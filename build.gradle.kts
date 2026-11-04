plugins {
    java
}

group = "com.example"
version = "1.0-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

repositories {
    mavenCentral()
}

// The platform root, pinned by the deployment through CX_PLATFORM_VERSION (never a literal version).
val platformVersion: String? = providers.environmentVariable("CX_PLATFORM_VERSION").orNull

dependencies {
    if (platformVersion != null) {
        compileOnly(platform("ai.cortexis:platform-api:$platformVersion"))
        testImplementation(platform("ai.cortexis:platform-api:$platformVersion"))
    }
    testImplementation(platform("org.junit:junit-bom:5.11.4"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<JavaCompile>().configureEach {
    options.encoding = "UTF-8"
}

tasks.test {
    useJUnitPlatform()
}
