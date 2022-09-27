import static org.assertj.core.api.Assertions.assertThat;
import static us.abstracta.jmeter.javadsl.JmeterDsl.*;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;


import static org.assertj.core.api.Assertions.assertThat;
import static us.abstracta.jmeter.javadsl.JmeterDsl.*;
import static us.abstracta.jmeter.javadsl.dashboard.DashboardVisualizer.*;

import java.io.File;
import java.io.IOException;
import java.time.Duration;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class PerformanceTest {

  @Test
  public void testSimple() throws IOException {
    String reportDir = "./report/testSimple";

    TestPlanStats stats = testPlan(
        threadGroup(
            10,
            10,
            httpSampler("api.expensify.ml"),
            uniformRandomTimer(500, 2000)),
        dashboardVisualizer(),
        htmlReporter(reportDir)).run();

    assertThat(stats.overall().sampleTimePercentile99()).isLessThan(Duration.ofSeconds(2));
  }
}
