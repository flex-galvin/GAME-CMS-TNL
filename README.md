# CMS Web Game
A product make by Galvin

## Nginx Rate Limit
```Http (after limit_conn_zone)
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=api_zone:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=socket_zone:10m rate=30r/s;
limit_req_status 429;
```

```Server
location /api/ {
      limit_req zone=api_zone burst=10 nodelay;
      
      proxy_pass http://127.0.0.1:5003;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header REMOTE-HOST $remote_addr;

      proxy_connect_timeout 30s;
      proxy_read_timeout 86400s;
      proxy_send_timeout 30s;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_redirect off;
    }

location /socket.io/ {
    limit_conn perip 5;
    limit_req zone=socket_zone burst=20 nodelay;
    proxy_pass http://127.0.0.1:5003/socket.io/;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header REMOTE-HOST $remote_addr;

    proxy_connect_timeout 30s;
    proxy_send_timeout 3600s;
    proxy_read_timeout 3600s;
    proxy_redirect off;
}

location / {
    limit_req zone=req_zone burst=20 nodelay;
    
    proxy_pass http://127.0.0.1:5003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    add_header X-Cache $upstream_cache_status;

    proxy_connect_timeout 30s;
    proxy_read_timeout 86400s;
    proxy_send_timeout 30s;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## Nginx URL Rewrite
location /upload {
  alias /.../upload;
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location /item {
  alias /.../item;
}
location /landing {
  alias /.../landing;
}