const fs = require('fs');
const path = require('path');
const http = require('http');

const server = http.createServer(async (req,res)=>{
    const method = req?.method;

    const { pathname, searchParams } = new URL(`http://localhost:3000${req.url}`);

    if (req.method === 'OPTIONS') {
        // Respond to preflight requests with the necessary CORS headers
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    if (method === "GET") {
        if (pathname === "/") {
            const page = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
            
            res.writeHead(200, { "Content-Type": "text/html", });
            res.write(page);
            return res.end();
        }

        if (pathname === "/script.js") {
            const javascript = fs.readFileSync(path.join(process.cwd(), "script.js"), "utf-8");

            res.writeHead(200, { "Content-Type": "text/javascript", });
            res.write(javascript);
            return res.end();
        }

        if (pathname === "/styles.css") {
            const css = fs.readFileSync(path.join(process.cwd(), "styles.css"), "utf8");

            res.writeHead(200, { "Content-Type": "text/css", });
            res.write(css);
            return res.end();
        }

        if (pathname === "/categories") {
            const pageData = fs.readFileSync(path.join(process.cwd(), "/pages/categories.html"), "utf-8");

            res.writeHead(200, { "Content-Type": "text/css", });
            res.write(pageData);
            return res.end();
        }

        if (pathname === "/search") {
            const pageData = fs.readFileSync(path.join(process.cwd(), "/pages/search.html"), "utf-8");

            res.writeHead(200, { "Content-Type": "text/css", });
            res.write(pageData);
            return res.end();
        }

        if (pathname === "/edit") {
            const pageData = fs.readFileSync(path.join(process.cwd(), "/pages/edit.html"), "utf-8");

            res.writeHead(200, { "Content-Type": "text/css", });
            res.write(pageData);
            return res.end();
        }

        if (pathname === "/searchbyid") {
            const id = searchParams.get("id");

            const moviesRaw = fs.readFileSync(path.join(process.cwd(), "/movies.json"));
            const movies = JSON.parse(moviesRaw);

            const movie = movies.find(movie => movie.id === id);
            if (movie === undefined) {
                res.writeHead(404);
                return res.end();
            }

            res.writeHead(200, { "Content-Type": "text/html", });

            const html = `
                <hr class="mt-4"/>
                <h3 class="text-2xl">${movie.name}</h3>
                <p>${movie.category}<p>
            `
            res.write(html);
            return res.end();
        }

        if (pathname === "/searchbycategory") {
            const category = searchParams.get("category");

            const moviesRaw = fs.readFileSync(path.join(process.cwd(), "/movies.json"));
            const movies = JSON.parse(moviesRaw);

            let movieList = movies;
            if (category) {
                movieList = movies.filter(movie => movie.category === category);
            }
            
            if (movieList.length < 1) {
                res.writeHead(404);
                return res.end();
            }

            res.writeHead(200, { "Content-Type": "text/html", });

            let returnHTML = "<div class='h-40 overflow-y-scroll'>";

            movieList.forEach(movie => {
                returnHTML += `<h3 class="text-2xl">${movie.name}</h3>\n<p>${movie.category} (ID: ${movie.id})</p><hr class="mb-4"/>`;
            });

            returnHTML += "</div>";

            res.write(returnHTML);
            return res.end();
        }
    }
    
    if (method === "POST") {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk;
        });
    
        req.on('end', () => {
            const jsonData = JSON.parse(body);
            
            if (
                !jsonData?.id ||
                !jsonData?.name ||
                !jsonData?.category
            ) {
                res.writeHead(411);
                return res.end();
            }
    
            const moviesRaw = fs.readFileSync(path.join(process.cwd(), "/movies.json"));
            const movies = JSON.parse(moviesRaw);

            const movie = movies.find(movie => movie.id === jsonData.id);
            
            if (movie !== undefined) {
                res.writeHead(403);
                return res.end();
            }

            console.log(jsonData);

            movies.push({
                id: jsonData.id,
                name: jsonData.name,
                category: jsonData.category,
            });

            fs.writeFileSync("./movies.json", JSON.stringify(movies)); 
                
            res.writeHead(200, { "Content-Type": "text/text"});
            res.end();
            return;
        });
    }
    
    if (method === "PATCH") {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk;
        });
    
        req.on('end', () => {
            const jsonData = JSON.parse(body);
            
            if (
                !jsonData?.id ||
                !jsonData?.name ||
                !jsonData?.category
            ) {
                res.writeHead(411);
                return res.end();
            }
    
            const data = getData();
            
            let movie = data.find(movie => movie.id === jsonData.id);

            if (movie === undefined) {
                res.writeHead(404);
                return res.end();
            }

            const movieIndex = data.indexOf(movie);

            data[movieIndex] = {
                id: jsonData.id,
                name: jsonData.name,
                category: jsonData.category,
            };

            fs.writeFileSync("./movies.json", JSON.stringify(data)); 
                
            res.writeHead(200, { "Content-Type": "application/json"});
            res.write(JSON.stringify(data));
            res.end();
            return;
        });
    }

    if (method === "DELETE") {
        const moviesRaw = fs.readFileSync(path.join(process.cwd(), "/movies.json"));
        const movies = JSON.parse(moviesRaw);

        if (!searchParams.has("id")) {
            res.writeHead(411);
            return res.end();
        }

        const movie = movies.find(movie => movie.id === searchParams.get("id"));

        if (!movie) {
            res.writeHead(404);
            return res.end();
        }

        const movieIndex = movies.indexOf(movie);
        movies.splice(movieIndex, 1);

        fs.writeFileSync("./movies.json", JSON.stringify(movies)); 

        res.writeHead(200, { "Content-Type": "text/plain", });
        return res.end();
    }

});

server.listen(3000, "localhost", () => {
    console.log("Listening on port 3000");
});
        
