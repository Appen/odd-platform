package com.provectus.oddplatform.config;

import com.provectus.oddplatform.config.properties.MetricExporterProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableWebFluxSecurity
@EnableConfigurationProperties({MetricExporterProperties.class})
public class ODDPlatformConfiguration {
}
