FROM bellsoft/liberica-openjdk-alpine:17
LABEL MAINTAINER="Seoryeong Min(msr980929@gmail.com)"

WORKDIR /app
COPY target/*.jar app.jar

#VOLUME /tmp
#CMD ["./mvnw", "clean", "package"]
#ARG JAR_FILE=target/*.jar
#COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
