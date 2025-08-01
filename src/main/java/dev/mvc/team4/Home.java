package dev.mvc.team4;

public class Home {
  public static String getUploadDir() {
    String ci = System.getenv("CI");
    if ("true".equals(ci)) {
      return "build/uploads/";  // GitHub Actions용 상대경로 (쓰기 가능)
    }

    String osName = System.getProperty("os.name").toLowerCase();
    String path = "";

    if (osName.contains("win")) {
      path = "C:\\kd\\deploy\\team4_v2sbm3c\\home\\storage\\";
    } else if (osName.contains("mac")) {
      path = "/Users/kimjiun/kd/deploy/team4_v2sbm3c/home/storage/";
    } else {
      path = "/home/ubuntu/deploy/team4_v2sbm3c/home/storage/";
    }

    return path;
  }
}