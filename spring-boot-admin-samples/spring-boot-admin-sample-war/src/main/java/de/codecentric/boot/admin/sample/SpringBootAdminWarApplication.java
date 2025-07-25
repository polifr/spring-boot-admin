/*
 * Copyright 2014-2023 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.codecentric.boot.admin.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import de.codecentric.boot.admin.server.config.AdminServerProperties;
import de.codecentric.boot.admin.server.config.EnableAdminServer;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.POST;

@SpringBootApplication
@EnableAdminServer
public class SpringBootAdminWarApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootAdminWarApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application;
	}

	@Profile("insecure")
	@Configuration(proxyBeanMethods = false)
	public static class SecurityPermitAllConfig {

		private final AdminServerProperties adminServer;

		public SecurityPermitAllConfig(AdminServerProperties adminServer) {
			this.adminServer = adminServer;
		}

		@Bean
		public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			http.authorizeHttpRequests((authorizeRequests) -> authorizeRequests.anyRequest().permitAll())
				.csrf((csrf) -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
					.ignoringRequestMatchers(
							PathPatternRequestMatcher.withDefaults().matcher(POST, this.adminServer.path("/instances")),
							PathPatternRequestMatcher.withDefaults()
								.matcher(DELETE, this.adminServer.path("/instances/*")),
							PathPatternRequestMatcher.withDefaults().matcher(this.adminServer.path("/actuator/**"))));
			return http.build();
		}

	}

	@Profile("secure")
	@Configuration(proxyBeanMethods = false)
	public static class SecuritySecureConfig {

		private final AdminServerProperties adminServer;

		public SecuritySecureConfig(AdminServerProperties adminServer) {
			this.adminServer = adminServer;
		}

		@Bean
		protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
			successHandler.setTargetUrlParameter("redirectTo");
			successHandler.setDefaultTargetUrl(this.adminServer.path("/"));

			http.authorizeHttpRequests((authorizeRequests) -> authorizeRequests
				.requestMatchers(PathPatternRequestMatcher.withDefaults().matcher(this.adminServer.path("/assets/**")))
				.permitAll()
				.requestMatchers(PathPatternRequestMatcher.withDefaults().matcher(this.adminServer.path("/login")))
				.permitAll()
				.anyRequest()
				.authenticated())

				.formLogin((formLogin) -> formLogin.loginPage(this.adminServer.path("/login"))
					.successHandler(successHandler))
				.logout((logout) -> logout.logoutUrl(this.adminServer.path("/logout")))
				.httpBasic(Customizer.withDefaults())
				.csrf((csrf) -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
					.ignoringRequestMatchers(
							PathPatternRequestMatcher.withDefaults().matcher(POST, this.adminServer.path("/instances")),
							PathPatternRequestMatcher.withDefaults()
								.matcher(DELETE, this.adminServer.path("/instances/*")),
							PathPatternRequestMatcher.withDefaults().matcher(this.adminServer.path("/actuator/**"))));

			return http.build();
		}

	}

}
