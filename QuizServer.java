import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class QuizServer {

    private static final int PORT = 8085;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", new StaticFileHandler());
        server.setExecutor(null); // default executor
        System.out.println("Quiz Server started at http://localhost:" + PORT + "/");
        server.start();
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            
            // Default to index.html
            if (path.equals("/")) {
                path = "/index.html";
            }

            // Clean path
            path = path.substring(1);
            File file = new File(path);

            if (!file.exists() || file.isDirectory()) {
                String response = "404 (Not Found)\nFile not found: " + path;
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            // Determine content type
            String contentType = "text/plain";
            if (path.endsWith(".html")) {
                contentType = "text/html";
            } else if (path.endsWith(".css")) {
                contentType = "text/css";
            } else if (path.endsWith(".js")) {
                contentType = "application/javascript";
            }

            // Send headers
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, file.length());

            // Write file content
            OutputStream os = exchange.getResponseBody();
            FileInputStream fis = new FileInputStream(file);
            byte[] buffer = new byte[4096];
            int count;
            while ((count = fis.read(buffer)) != -1) {
                os.write(buffer, 0, count);
            }
            fis.close();
            os.close();
        }
    }
}
