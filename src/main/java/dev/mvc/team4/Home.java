package dev.mvc.team4;

public class Home {
  public static String getUploadDir() {
    String osName = System.getProperty("os.name").toLowerCase();
    String path = "";

    if (osName.contains("win")) { // Windows
      path = "C:\\kd\\deploy\\team4_v2sbm3c\\home\\storage\\";
      // F:\kd8\\deploy\\issue_v1jpac\\home\\storage
      // System.out.println("Windows: " + path);
    } else if (osName.contains("mac")) { // MacOS
      path = "/Users/kimjiun/kd/deploy/team4_v2sbm3c/home/storage/";
      // System.out.println("MacOS: " + path);
    } else { // Linux
      path = "/home/ubuntu/deploy/team4_v2sbm3c/home/storage/";
      // System.out.println("Linux: " + path);
    }

    return path;
  }
}