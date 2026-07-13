const fs = require('fs');

const file = 'c:\\Users\\CTNick\\Desktop\\kod\\targonsecuritysite\\en\\index.html';
let content = fs.readFileSync(file, 'utf8');

const badPart = `            <div class="services-grid reveal">
                <!-- Service 1 -->
                <div class="service-card">
                    <div class="service-icon"><i class="fas fa-shield-virus"></i></div>
                    <h3>Cybersecurity</h3>
                    <p>Endpoint security, vulnerability scanning, and advanced threat detection systems.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    <!-- Service 2 -->
                <div class="service-card">
                    <div class="service-card-glow"></div>
                    <div class="service-icon"><i class="fas fa-network-wired"></i></div>
                    <h3>Enterprise Network &amp; Infrastructure</h3>
                    <p>Design, deployment, and management of enterprise network infrastructure.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                
                <!-- Service 3 -->
                <div class="service-card">
                    <div class="service-icon"><i class="fas fa-building"></i></div>
                    <h3>SMB IT Services</h3>
                    <p>Custom IT solutions and support services for small and medium-sized businesses.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                
                </section>`;

const goodPart = `            <div class="services-grid reveal">
                <!-- Service 1 -->
                <div class="service-card">
                    <div class="service-icon"><i class="fas fa-shield-virus"></i></div>
                    <h3>Cybersecurity</h3>
                    <p>Endpoint security, vulnerability scanning, and advanced threat detection systems.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                
                <!-- Service 2 -->
                <div class="service-card">
                    <div class="service-card-glow"></div>
                    <div class="service-icon"><i class="fas fa-network-wired"></i></div>
                    <h3>Enterprise Network &amp; Infrastructure</h3>
                    <p>Design, deployment, and management of enterprise network infrastructure.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                
                <!-- Service 3 -->
                <div class="service-card">
                    <div class="service-icon"><i class="fas fa-building"></i></div>
                    <h3>SMB IT Services</h3>
                    <p>Custom IT solutions and support services for small and medium-sized businesses.</p>
                    <a href="services.html" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>`;

content = content.replace(badPart, goodPart);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed en/index.html');
