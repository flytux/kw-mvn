## TEST ##

mvn compile com.google.cloud.tools:jib-maven-plugin:3.1.4:build \
-DsendCredentialsOverHttp=true -Dimage=docker.kubeworks.net/kw-dev:v1 -Djib.allowInsecureRegistries=true \
-Djib.from.image=docker.kubeworks.net/adoptopenjdk:11 -Djib.to.auth.username=admin \
-Djib.to.auth.password=1