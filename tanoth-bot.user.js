// ==UserScript==
// @name         Tanoth Bot Osobisty (Wersja 9.0 - Równoległe Zadania)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Automatyczny bot: Atrybuty, Przygody, Krąg, Mapa, Lochy, Praca i Handel!
// @author       Neymaro007
// @match        https://*.tanoth.gameforge.com/main/client*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey: Oczekuję na załadowanie gry Tanoth...");

    let isBotRunning = false;
    let mainBotLoopActive = false;

    let checkReady = setInterval(function() {
        if (typeof window.flashvars !== 'undefined' && window.flashvars.sessionID) {
            if (!document.getElementById('tanothBotGuiPremium')) {
                clearInterval(checkReady);
                createPremiumGUI();
            }
        }
    }, 1500);

    function createPremiumGUI() {
        const gui = document.createElement('div');
        gui.id = 'tanothBotGuiPremium';
        gui.style.position = 'fixed';
        gui.style.bottom = '20px';
        gui.style.right = '20px';
        gui.style.width = '320px';
        gui.style.background = 'rgba(20, 15, 10, 0.95)';
        gui.style.border = '2px solid #8b6508';
        gui.style.borderRadius = '5px';
        gui.style.boxShadow = '0px 5px 20px rgba(0,0,0,0.9)';
        gui.style.color = '#d4c098';
        gui.style.fontFamily = 'Tahoma, sans-serif';
        gui.style.fontSize = '11px';
        gui.style.zIndex = '999999';
        gui.style.display = 'flex';
        gui.style.flexDirection = 'column';

        let html = '';
        
        html += '<div id="tb-header" style="cursor: move; background: linear-gradient(to bottom, #3a2a18, #1a120a); border-bottom: 1px solid #8b6508; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 3px 3px 0 0;">';
        html += '<span style="font-weight: bold; color: #e6c875; font-size: 13px;">🐉 Tanoth Bot v9.0</span>';
        html += '<span id="tb-min-btn" style="cursor: pointer; color: #ffaa00; font-weight: bold; font-size: 14px;" title="Minimalizuj">_</span>';
        html += '</div>';

        html += '<div id="tb-body">';

        html += '<div style="display: flex; background: #1a120a; border-bottom: 1px solid #5a4010; font-size: 10px;">';
        html += '<div class="tb-tab" data-target="tb-walka" style="flex: 1; text-align: center; padding: 6px; cursor: pointer; background: #3a2a18; color: #e6c875; font-weight: bold; border-right: 1px solid #5a4010;">🗡️ Walka</div>';
        html += '<div class="tb-tab" data-target="tb-bohater" style="flex: 1; text-align: center; padding: 6px; cursor: pointer; color: #8a7a5c; border-right: 1px solid #5a4010;">🧙 Bohater</div>';
        html += '<div class="tb-tab" data-target="tb-inne" style="flex: 1; text-align: center; padding: 6px; cursor: pointer; color: #8a7a5c; border-right: 1px solid #5a4010;">⚒️ Inne</div>';
        html += '<div class="tb-tab" data-target="tb-opcje" style="flex: 1; text-align: center; padding: 6px; cursor: pointer; color: #8a7a5c;">⚙️ Opcje</div>';
        html += '</div>';

        html += '<div id="tb-walka" class="tb-content" style="padding: 10px; display: block;">';
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">PRZYGODY</b></div>';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><label>Priorytet:</label><select id="cfg_priority" style="background:#2a1e12; color:#e6c875; border:1px solid #8b6508;"><option value="experience">Doświadczenie</option><option value="gold">Złoto</option></select></div>';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><label>Trudność:</label><select id="cfg_difficulty" style="background:#2a1e12; color:#e6c875; border:1px solid #8b6508;"><option value="easy">Łatwe</option><option value="medium">Średnie</option><option value="difficult">Trudne</option><option value="very_difficult" selected>B. Trudne</option></select></div>';
        
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px; display:flex; justify-content:space-between;"><b style="color:#e6c875;">MAPA I LOCHY</b> <span><input type="checkbox" id="cfg_doMap" checked title="Włącz automat mapy"><label style="color:#44ff44; cursor:pointer;" for="cfg_doMap"> Włącz</label></span></div>';
        html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 5px;">';
        html += '<label><input type="checkbox" id="cfg_map_exp" checked> Bór (Exp)</label>';
        html += '<label><input type="checkbox" id="cfg_map_gold" checked> Pustynia (Złoto)</label>';
        html += '<label><input type="checkbox" id="cfg_map_attr" checked> Mokradła (Atr)</label>';
        html += '<label><input type="checkbox" id="cfg_map_adv" checked> Wyspa (Przyg)</label>';
        html += '<label><input type="checkbox" id="cfg_map_work"> Góry (Praca)</label>';
        html += '<label><input type="checkbox" id="cfg_map_item"> Jar (Przedm)</label>';
        html += '</div>';
        html += '<div style="margin-top:5px; padding-top:5px; border-top: 1px dotted #5a4010;"><label><input type="checkbox" id="cfg_map_cave" checked> <b style="color:#b5a0f5;">Jaskinia Iluzji (Loch)</b></label></div>';
        html += '</div>';

        html += '<div id="tb-bohater" class="tb-content" style="padding: 10px; display: none;">';
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">ZŁOTO</b></div>';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><label>Wydawaj na:</label><select id="cfg_spendOn" style="background:#2a1e12; color:#e6c875; border:1px solid #8b6508;"><option value="attributes">Atrybuty</option><option value="circle">Krąg (+Atr)</option></select></div>';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><label>Zostaw Min. Złota:</label><input type="number" id="cfg_minGold" value="0" min="0" style="width: 60px; background:#2a1e12; color:#e6c875; border:1px solid #8b6508; text-align:center;"></div>';
        
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">ROZWÓJ ATRYBUTÓW</b></div>';
        html += '<div style="display: flex; flex-direction:column; gap: 4px;">';
        html += '<label><input type="checkbox" id="cfg_attr_STR" checked> Kupuj Siłę</label>';
        html += '<label><input type="checkbox" id="cfg_attr_DEX" checked> Kupuj Zręczność</label>';
        html += '<label><input type="checkbox" id="cfg_attr_CON" checked> Kupuj Kondycję</label>';
        html += '<label><input type="checkbox" id="cfg_attr_INT" checked> Kupuj Inteligencję</label>';
        html += '</div>';
        html += '</div>';

        html += '<div id="tb-inne" class="tb-content" style="padding: 10px; display: none;">';
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">MODUŁ PRACY</b></div>';
        html += '<div style="display: flex; flex-direction:column; gap: 6px; margin-bottom:10px;">';
        html += '<label title="Pracuje gdy braknie przygód i pustej mapie"><input type="checkbox" id="cfg_doWork" checked> Pracuj po wyczyszczeniu zazn. mapy</label>';
        html += '<div style="display: flex; justify-content: space-between; margin-top:2px;"><label>Czas pracy:</label><select id="cfg_workHours" style="background:#2a1e12; color:#e6c875; border:1px solid #8b6508;">';
        for(let i=1; i<=12; i++) { html += '<option value="'+i+'" '+(i===1?'selected':'')+'>'+i+' Godzin</option>'; }
        html += '</select></div>';
        html += '</div>';

        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">AUTO SPRZEDAŻ (Ignoruje mikstury/runy/klejnoty)</b></div>';
        html += '<div style="display: flex; flex-direction:column; gap: 4px;">';
        html += '<label><input type="checkbox" id="cfg_sellNormal" checked> Sprzedawaj Zwykłe Przedmioty</label>';
        html += '<label><input type="checkbox" id="cfg_sellEpic"> Sprzedawaj Unikaty/Epickie</label>';
        html += '</div>';
        html += '</div>';

        html += '<div id="tb-opcje" class="tb-content" style="padding: 10px; display: none;">';
        html += '<div style="margin-bottom: 8px; border-bottom: 1px dotted #5a4010; padding-bottom: 4px;"><b style="color:#e6c875;">UŻYCIE KARNEOLI</b></div>';
        html += '<div style="display: flex; flex-direction:column; gap: 6px; margin-bottom:10px;">';
        html += '<label title="Gdy skończą się darmowe"><input type="checkbox" id="cfg_useBloodstones" checked> Odnawiaj pule Przygód</label>';
        html += '<label title="Gdy skończy się energia"><input type="checkbox" id="cfg_useBloodstonesMap"> Kupuj Ataki na Mapie/Lochu</label>';
        html += '<div style="display: flex; justify-content: space-between; margin-top:5px;"><label>Zostaw Min. Karneoli:</label><input type="number" id="cfg_minBloodstones" value="0" min="0" style="width: 60px; background:#2a1e12; color:#e6c875; border:1px solid #8b6508; text-align:center;"></div>';
        html += '</div>';
        html += '</div>';

        html += '<div style="background: #0a0805; padding: 5px; border-top: 1px solid #5a4010; border-bottom: 1px solid #5a4010;">';
        html += '<div style="color:#8a7a5c; font-size:9px; margin-bottom:2px;">LOGI OPERACYJNE:</div>';
        html += '<div id="tb-console" style="height: 55px; overflow-y: auto; font-family: monospace; font-size: 10px; color: #a99d85; display:flex; flex-direction:column; gap:2px;">';
        html += '<div>[System] Oczekuję na start...</div>';
        html += '</div>';
        html += '</div>';

        html += '<div style="padding: 10px; display: flex; justify-content: space-between; align-items: center; background: #1a120a; border-radius: 0 0 3px 3px;">';
        html += '<div style="font-size:12px;">Status: <b id="botStatus" style="color: #ff4444;">ZATRZYMANY</b></div>';
        html += '<button id="toggleBotBtn" style="background: #3a2a18; border: 1px solid #e6c875; color: #e6c875; padding: 6px 15px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: 0.2s;">▶ URUCHOM</button>';
        html += '</div>';

        html += '</div>'; 
        gui.innerHTML = html;
        document.body.appendChild(gui);

        const tabs = document.querySelectorAll('.tb-tab');
        const contents = document.querySelectorAll('.tb-content');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { 
                    t.style.background = 'transparent'; 
                    t.style.color = '#8a7a5c'; 
                    t.style.fontWeight = 'normal'; 
                });
                contents.forEach(function(c) { c.style.display = 'none'; });
                
                this.style.background = '#3a2a18';
                this.style.color = '#e6c875';
                this.style.fontWeight = 'bold';
                const targetId = this.getAttribute('data-target');
                document.getElementById(targetId).style.display = 'block';
            });
        });

        const minBtn = document.getElementById('tb-min-btn');
        const bodyEl = document.getElementById('tb-body');
        minBtn.addEventListener('click', function() {
            if (bodyEl.style.display === 'none') {
                bodyEl.style.display = 'block';
                this.innerText = '_';
                this.title = 'Minimalizuj';
            } else {
                bodyEl.style.display = 'none';
                this.innerText = '□';
                this.title = 'Rozwiń';
            }
        });

        const header = document.getElementById('tb-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', function(e) {
            if (e.target.id === 'tb-min-btn') return;
            isDragging = true;
            const rect = gui.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + gui.offsetWidth > window.innerWidth) newX = window.innerWidth - gui.offsetWidth;
            if (newY + gui.offsetHeight > window.innerHeight) newY = window.innerHeight - gui.offsetHeight;
            gui.style.left = newX + 'px';
            gui.style.top = newY + 'px';
            gui.style.right = 'auto'; 
            gui.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        const btn = document.getElementById('toggleBotBtn');
        btn.onmouseover = function() { this.style.background = '#503a21'; };
        btn.onmouseout = function() { this.style.background = '#3a2a18'; };

        btn.addEventListener('click', function() {
            if (isBotRunning) {
                isBotRunning = false;
                document.getElementById('botStatus').innerText = "STAWANIE...";
                document.getElementById('botStatus').style.color = "#ffaa00";
                updateGuiAction("Dokończy obecną akcję i stanie.");
                this.innerHTML = "▶ URUCHOM";
            } else {
                isBotRunning = true;
                window.botStartLocalTime = Date.now();
                document.getElementById('botStatus').innerText = "AKTYWNY";
                document.getElementById('botStatus').style.color = "#44ff44";
                updateGuiAction("Rozpoczynam pracę...");
                this.innerHTML = "⏸ ZATRZYMAJ";
                if (!mainBotLoopActive) uruchomBota();
            }
        });
    }

    function getConfig() {
        let selectedAttrs = [];
        if (document.getElementById('cfg_attr_STR').checked) selectedAttrs.push('STR');
        if (document.getElementById('cfg_attr_DEX').checked) selectedAttrs.push('DEX');
        if (document.getElementById('cfg_attr_CON').checked) selectedAttrs.push('CON');
        if (document.getElementById('cfg_attr_INT').checked) selectedAttrs.push('INT');
        if (selectedAttrs.length === 0) selectedAttrs = ['STR', 'DEX', 'CON', 'INT'];

        let allowedMapLocs = [];
        if (document.getElementById('cfg_map_work').checked) allowedMapLocs.push(0, 1, 2);
        if (document.getElementById('cfg_map_item').checked) allowedMapLocs.push(3, 4, 5);
        if (document.getElementById('cfg_map_exp').checked) allowedMapLocs.push(6, 7, 8);
        if (document.getElementById('cfg_map_attr').checked) allowedMapLocs.push(9, 10, 11);
        if (document.getElementById('cfg_map_gold').checked) allowedMapLocs.push(12, 13, 14);
        if (document.getElementById('cfg_map_adv').checked) allowedMapLocs.push(15, 16, 17); 
        
        let doCave = document.getElementById('cfg_map_cave').checked;

        return {
            server_speed: 2, 
            url: window.flashvars.serverpath,
            priorityAdventure: document.getElementById('cfg_priority').value,
            difficulty: document.getElementById('cfg_difficulty').value,
            spendGoldOn: document.getElementById('cfg_spendOn').value,
            priorityAttributes: selectedAttrs,
            minGoldToSpend: parseInt(document.getElementById('cfg_minGold').value) || 0,
            useBloodstones: document.getElementById('cfg_useBloodstones').checked,
            minBloodstonesToSpend: parseInt(document.getElementById('cfg_minBloodstones').value) || 0,
            doMap: document.getElementById('cfg_doMap').checked,
            allowedMapLocs: allowedMapLocs,
            doCave: doCave,
            useBloodstonesMap: document.getElementById('cfg_useBloodstonesMap').checked,
            doWork: document.getElementById('cfg_doWork').checked,
            workHours: parseInt(document.getElementById('cfg_workHours').value) || 1,
            sellNormal: document.getElementById('cfg_sellNormal').checked,
            sellEpic: document.getElementById('cfg_sellEpic').checked
        };
    }

    function updateGuiAction(text) {
        const consoleEl = document.getElementById('tb-console');
        if (consoleEl) {
            const time = new Date().toLocaleTimeString('pl-PL', { hour12: false });
            const logLine = document.createElement('div');
            
            if (text.indexOf("Atakuję") !== -1 || text.indexOf("Rozpoczynam wyprawę") !== -1 || text.indexOf("Wysyłam") !== -1 || text.indexOf("Rozpoczynam Pracę") !== -1) {
                logLine.style.color = "#44ff44"; 
            } else if (text.indexOf("Kupuję") !== -1 || text.indexOf("Wykupuję") !== -1 || text.indexOf("Sprzedaję") !== -1) {
                logLine.style.color = "#ffaa00"; 
            } else if (text.indexOf("Brak") !== -1 || text.indexOf("Oczekuję") !== -1 || text.indexOf("Czekam") !== -1 || text.indexOf("Tryb") !== -1 || text.indexOf("Wstrzymuję") !== -1) {
                logLine.style.color = "#8a7a5c"; 
            } else if (text.indexOf("Aktywne zadanie") !== -1 || text.indexOf("Trwa walka") !== -1) {
                logLine.style.color = "#b5a0f5"; 
            }

            logLine.innerText = "[" + time + "] " + text;
            consoleEl.appendChild(logLine);

            while (consoleEl.childNodes.length > 25) {
                consoleEl.removeChild(consoleEl.firstChild);
            }
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    }

    function uruchomBota() {
        mainBotLoopActive = true;
        const difficultyMap = { easy: -1, medium: 0, difficult: 1, very_difficult: 2 };
        
        let adventureCooldown = 0; 
        
        function sleep(seconds) {
            return new Promise(function(resolve) { setTimeout(resolve, seconds * 1000); });
        }

        function getCurrentServerTime() {
            let initialServerTime = parseInt(window.flashvars.servertime) || Math.floor(Date.now() / 1000);
            let timeElapsedSeconds = Math.floor((Date.now() - window.botStartLocalTime) / 1000);
            return initialServerTime + timeElapsedSeconds;
        }

        function findValueByName(xmlNode, name) {
            const nameNodes = xmlNode.getElementsByTagName('name');
            for (let i = 0; i < nameNodes.length; i++) {
                if (nameNodes[i].textContent === name) {
                    const memberNode = nameNodes[i].parentNode;
                    if (memberNode && memberNode.nodeName === 'member') {
                        const valueNode = memberNode.getElementsByTagName('value')[0];
                        if (valueNode) return valueNode.textContent.trim();
                    }
                }
            }
            return null;
        }

        async function fetchXmlData(url, xmlData) {
            try {
                const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/xml' }, body: xmlData });
                if (!response.ok) throw new Error("HTTP error! status: " + response.status);
                return await response.text();
            } catch (error) {
                console.error("Blad komunikacji:", error);
                throw error;
            }
        }

        function parseResourcesXMLResponse(xmlString) {
            const xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
            const bsValue = findValueByName(xmlDoc, 'bs') || findValueByName(xmlDoc, 'bloodstones');
            return {
                gold: parseInt(findValueByName(xmlDoc, 'gold')) || 0,
                bloodstones: parseInt(bsValue) || 0,
            };
        }

        async function getCurrentResources(config){
            const xmlGetResources = '<methodCall><methodName>MiniUpdate</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
            const xmlResourcesData = await fetchXmlData(config.url, xmlGetResources);
            return parseResourcesXMLResponse(xmlResourcesData);
        }

        async function getActiveTask(config) {
            const xmlReq = '<methodCall><methodName>MiniUpdate</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
            const xmlData = await fetchXmlData(config.url, xmlReq);
            const xmlDoc = new DOMParser().parseFromString(xmlData, "text/xml");
            
            let activeModule = null;
            const activeModuleNode = Array.from(xmlDoc.getElementsByTagName('name')).find(n => n.textContent === 'active_module');
            
            if (activeModuleNode && activeModuleNode.parentNode) {
                const structNode = activeModuleNode.parentNode.getElementsByTagName('struct')[0];
                if (structNode && structNode.getElementsByTagName('member').length > 0) { 
                    let time = parseInt(findValueByName(structNode, 'time')) || 0;
                    let type = findValueByName(structNode, 'type') || '';
                    if (time > 0 && type !== '') {
                        activeModule = { time: time, type: type };
                    }
                }
            }
            return activeModule;
        }

        function parseActivityTime(xmlDoc) {
            const nameNodes = xmlDoc.getElementsByTagName('name');
            for (let i = 0; i < nameNodes.length; i++) {
                if (nameNodes[i].textContent === 'current_activity') {
                    const parent = nameNodes[i].parentNode;
                    if (parent && parent.nodeName === 'member') {
                        const struct = parent.getElementsByTagName('struct')[0];
                        if (struct) {
                            let t = parseInt(findValueByName(struct, 'time'));
                            if (!isNaN(t) && t > 0) return t;
                            
                            let dur = parseInt(findValueByName(struct, 'duration'));
                            if (!isNaN(dur) && dur > 0) return dur;

                            let endtime = parseInt(findValueByName(struct, 'endtime')) || parseInt(findValueByName(struct, 'end_time'));
                            if (!isNaN(endtime) && endtime > 10000000) {
                                let left = endtime - getCurrentServerTime();
                                return left > 0 ? left : 0;
                            }
                            
                            let timeRemain = parseInt(findValueByName(struct, 'time_remain'));
                            if (!isNaN(timeRemain) && timeRemain > 0) return timeRemain;

                            return 10;
                        }
                    }
                }
            }
            return 0;
        }

        async function processCircle(config) {
            if (config.spendGoldOn !== 'circle') return;
            let oldCurrentResourcesGold = -1; 
            
            while (isBotRunning) {
                try {
                    const xmlGetCircle = '<methodCall><methodName>EvocationCircle_getCircle</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                    const xmlCircleData = await fetchXmlData(config.url, xmlGetCircle);
                    const xmlDoc = new DOMParser().parseFromString(xmlCircleData, "text/xml");
                    const members = xmlDoc.getElementsByTagName("member");
                    const circleItems = {};
                    
                    for (let i = 0; i < members.length; i++) {
                      const name = members[i].getElementsByTagName("name")[0] ? members[i].getElementsByTagName("name")[0].textContent : null;
                      const valueString = members[i].getElementsByTagName("string")[0] ? members[i].getElementsByTagName("string")[0].textContent : null;
                      if (name && valueString) circleItems[name] = valueString.split(":").map(Number);
                    }

                    let bestItem = null;
                    if (!circleItems || !circleItems[16]) bestItem = null;
                    else if (circleItems[16][0] == 10) bestItem = null;
                    else if (circleItems[8][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 8;
                    else if (circleItems[1][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 1;
                    else if ((circleItems[15][0] < ((circleItems[16][0] + 1) * 10)) && (((circleItems[15][0] + 1) * 10) <= circleItems[9][0])  && (((circleItems[15][0] + 1) * 10) <= circleItems[10][0])) bestItem = 15;
                    else if (circleItems[9][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 9;
                    else if (circleItems[10][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 10;
                    else if ((circleItems[11][0] < ((circleItems[16][0] + 1) * 10)) && (((circleItems[11][0] + 1) * 10) <= (circleItems[1][0])) && (((circleItems[11][0] + 1) * 10) <= (circleItems[2][0]))) bestItem = 11;
                    else if (circleItems[2][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 2;
                    else if ((circleItems[12][0] < ((circleItems[16][0] + 1) * 10)) && (((circleItems[12][0] + 1) * 10) <= (circleItems[3][0])) && (((circleItems[12][0] + 1) * 10) <= (circleItems[4][0]))) bestItem = 12;
                    else if (circleItems[3][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 3;
                    else if (circleItems[4][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 4;
                    else if ((circleItems[13][0] < ((circleItems[16][0] + 1) * 10)) && (((circleItems[13][0] + 1) * 10) <= (circleItems[5][0]))  && (((circleItems[13][0] + 1) * 10) <= (circleItems[6][0]))) bestItem = 13;
                    else if (circleItems[5][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 5;
                    else if (circleItems[6][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 6;
                    else if ((circleItems[14][0] < ((circleItems[16][0] + 1) * 10)) && (((circleItems[14][0] + 1) * 10) <= (circleItems[7][0])) && (((circleItems[14][0] + 1) * 10) <= (circleItems[8][0]))) bestItem = 14;
                    else if (circleItems[7][0] < ((circleItems[16][0] + 1) * 100)) bestItem = 7;
                    else bestItem = 16;
                    
                    if (bestItem === null) {
                        updateGuiAction("Krąg ukończony! Zmieniam priorytet na Atrybuty.");
                        document.getElementById('cfg_spendOn').value = "attributes";
                        await sleep(2);
                        break;
                    }
                    
                    let currentResources = await getCurrentResources(config);
                    if (isNaN(currentResources.gold) || currentResources.gold === oldCurrentResourcesGold) break;
                    oldCurrentResourcesGold = currentResources.gold;

                    let itemCost = 0;
                    if (bestItem === 16) { itemCost = (circleItems[bestItem][11] * 2500) + 5000; } 
                    else if (bestItem >= 1 && bestItem <= 10) { itemCost = (circleItems[bestItem][11] * 5) + 10; } 
                    else if (bestItem >= 11 && bestItem <= 15) { itemCost = (circleItems[bestItem][11] * 50) + 100; } 
                    else break;
                    
                    if ((currentResources.gold - itemCost) >= config.minGoldToSpend) {
                        updateGuiAction("Kupuję Krąg: element ID " + bestItem);
                        const xmlBuyCircle = '<methodCall><methodName>EvocationCircle_buyNode</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><string>gold</string></value></param><param><value><int>' + bestItem + '</int></value></param><param><value><int>1</int></value></param></params></methodCall>';
                        await fetchXmlData(config.url, xmlBuyCircle);
                        await sleep(1);
                    } else {
                        break;
                    }
                } catch (error) { 
                    break; 
                }
            }
        }

        async function processAttributes() {
            while (isBotRunning) {
                let config = getConfig();
                if (config.spendGoldOn !== 'attributes') break;

                try {
                    const xmlGetAttributes = '<methodCall><methodName>GetUserAttributes</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                    const xmlData = await fetchXmlData(config.url, xmlGetAttributes);
                    const xmlDoc = new DOMParser().parseFromString(xmlData, "text/xml");
                    
                    let baseVal = parseFloat(findValueByName(xmlDoc, 'attributeCostBase')) || 10;
                    let incVal = parseFloat(findValueByName(xmlDoc, 'attributeCostIncrement')) || 5;
                    let factorVal = parseFloat(findValueByName(xmlDoc, 'attributeCostFactor')) || 0.5;

                    let strBought = parseInt(findValueByName(xmlDoc, 'str_bought'));
                    let dexBought = parseInt(findValueByName(xmlDoc, 'dex_bought'));
                    let conBought = parseInt(findValueByName(xmlDoc, 'con_bought'));
                    let intBought = parseInt(findValueByName(xmlDoc, 'int_bought'));

                    if (isNaN(strBought)) break;

                    let costValues = {
                        STR: Math.floor((strBought * incVal + baseVal) * factorVal),
                        DEX: Math.floor((dexBought * incVal + baseVal) * factorVal),
                        CON: Math.floor((conBought * incVal + baseVal) * factorVal),
                        INT: Math.floor((intBought * incVal + baseVal) * factorVal)
                    };
                    
                    let selectedAttribute = null;
                    let minValue = Infinity;
                    
                    for (const attr of config.priorityAttributes) {
                        if (costValues[attr] && costValues[attr] < minValue) {
                            minValue = costValues[attr];
                            selectedAttribute = attr;
                        }
                    }

                    if (!selectedAttribute) break;

                    let currentResources = await getCurrentResources(config);
                    if (isNaN(currentResources.gold)) break;

                    if ((currentResources.gold - costValues[selectedAttribute]) < config.minGoldToSpend) {
                        break; 
                    }

                    updateGuiAction("Kupuję Atrybut: " + selectedAttribute);
                    const xmlUpgradeAttribute = '<methodCall><methodName>RaiseAttribute</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><string>' + selectedAttribute + '</string></value></param><param><value><int>1</int></value></param></params></methodCall>';
                    await fetchXmlData(config.url, xmlUpgradeAttribute);
                    await sleep(0.2); 
                    
                } catch (error) { 
                    break; 
                }
            }
        }

        async function processInventory(config) {
            if (!config.sellNormal && !config.sellEpic) return;
            
            try {
                const xmlGetEquip = '<methodCall><methodName>GetEquipment</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                const equipDataXML = await fetchXmlData(config.url, xmlGetEquip);
                const equipDoc = new DOMParser().parseFromString(equipDataXML, "text/xml");
                
                let itemsList = [];
                const itemsMember = Array.from(equipDoc.getElementsByTagName('name')).find(n => n.textContent === 'items');
                if (itemsMember && itemsMember.parentNode) {
                    const dataNodes = itemsMember.parentNode.getElementsByTagName('data');
                    if (dataNodes.length > 0) {
                        const structs = dataNodes[0].childNodes;
                        for (let i = 0; i < structs.length; i++) {
                            let structNode = structs[i].getElementsByTagName('struct')[0];
                            if (structNode) {
                                let id = parseInt(findValueByName(structNode, 'id'));
                                let isEquipped = findValueByName(structNode, 'is_equipped') === '1';
                                let isUnique = findValueByName(structNode, 'is_unique') === '1';
                                let sellValue = parseInt(findValueByName(structNode, 'sellvalue')) || 0;
                                let type = parseInt(findValueByName(structNode, 'type')) || 0;

                                if (!isNaN(id) && !isEquipped) {
                                    itemsList.push({ id: id, isUnique: isUnique, sellValue: sellValue, type: type });
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < itemsList.length; i++) {
                    let item = itemsList[i];
                    
                    if (item.type === 9 || item.type === 10) continue; 

                    let shouldSell = false;
                    if (config.sellNormal && !item.isUnique) shouldSell = true;
                    if (config.sellEpic && item.isUnique) shouldSell = true;

                    if (shouldSell) {
                        let rarityName = item.isUnique ? "Unikatowy" : "Zwykły";
                        updateGuiAction("Sprzedaję " + rarityName + " przedmiot u Handlarza (+ " + item.sellValue + " złota)");
                        
                        const xmlSell = '<methodCall><methodName>SellItem</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><int>' + item.id + '</int></value></param><param><value><int>1</int></value></param><param><value><int>' + item.type + '</int></value></param></params></methodCall>';
                        await fetchXmlData(config.url, xmlSell);
                        await sleep(1.0); 
                    }
                }

            } catch (error) {
                console.error("Błąd Sprzedaży:", error);
            }
        }

        async function processMap(config) {
            if (!config.doMap) return { actionTaken: false, isCleared: true, waitTime: 0 };
            
            try {
                const xmlMapDetails = '<methodCall><methodName>GetMapDetails</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                const mapDetailsXML = await fetchXmlData(config.url, xmlMapDetails);
                const mapDetailsDoc = new DOMParser().parseFromString(mapDetailsXML, "text/xml");
                
                const currentActivityNode = Array.from(mapDetailsDoc.getElementsByTagName('name')).find(n => n.textContent === 'current_activity');
                if (currentActivityNode && currentActivityNode.parentNode) {
                    const structNode = currentActivityNode.parentNode.getElementsByTagName('struct')[0];
                    if (structNode) {
                        let status = findValueByName(structNode, 'status');
                        let timeRemain = parseInt(findValueByName(structNode, 'time_remain'));
                        
                        if (status === 'running' && !isNaN(timeRemain) && timeRemain > 0) {
                            return { actionTaken: false, isCleared: false, waitTime: timeRemain };
                        }
                    }
                }

                const xmlGetLib = '<methodCall><methodName>GetLiberationDetails</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                const libDataXML = await fetchXmlData(config.url, xmlGetLib);
                const libDoc = new DOMParser().parseFromString(libDataXML, "text/xml");

                const xmlGetCave = '<methodCall><methodName>GetCaveDetails</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                const caveDataXML = await fetchXmlData(config.url, xmlGetCave);
                const caveDoc = new DOMParser().parseFromString(caveDataXML, "text/xml");

                let currentResources = await getCurrentResources(config);
                let validTargets = [];

                if (config.doCave) {
                    const illusionBsCost = parseInt(findValueByName(caveDoc, "bloodstone_cost"));
                    const currentCaveCost = isNaN(illusionBsCost) ? 0 : illusionBsCost;
                    
                    if (currentCaveCost === 0 || (config.useBloodstonesMap && currentResources.bloodstones > config.minBloodstonesToSpend)) {
                        validTargets.push({isCave: true});
                    }
                }

                if (config.allowedMapLocs.length > 0) {
                    const currentEnergy = parseInt(findValueByName(libDoc, "energy")) || 0;

                    let territories = {};
                    const territoriesMember = libDoc.getElementsByTagName('name');
                    let terrValueNode = null;
                    for(let i=0; i<territoriesMember.length; i++){
                        if(territoriesMember[i].textContent === 'territories') {
                            let parent = territoriesMember[i].parentNode;
                            if (parent && parent.nodeName === 'member') {
                                let vals = parent.getElementsByTagName('value');
                                if (vals.length > 0) terrValueNode = vals[0];
                            }
                            break;
                        }
                    }

                    if (terrValueNode) {
                        const structs = terrValueNode.getElementsByTagName('struct');
                        for(let i=0; i<structs.length; i++){
                            let idText = findValueByName(structs[i], "id");
                            let id = parseInt(idText);
                            if (!isNaN(id) && idText !== null) {
                                let status = parseInt(findValueByName(structs[i], "status"));
                                territories[id] = { status: status };
                            }
                        }
                    }

                    let aliveMonsters = {};
                    const monstersMember = libDoc.getElementsByTagName('name');
                    let monstersValueNode = null;
                    for(let i=0; i<monstersMember.length; i++){
                        if(monstersMember[i].textContent === 'monsters') {
                            let parent = monstersMember[i].parentNode;
                            if (parent && parent.nodeName === 'member') {
                                let vals = parent.getElementsByTagName('value');
                                if (vals.length > 0) monstersValueNode = vals[0];
                            }
                            break;
                        }
                    }

                    if (monstersValueNode) {
                        const structs = monstersValueNode.getElementsByTagName('struct');
                        for(let i=0; i<structs.length; i++){
                            let locText = findValueByName(structs[i], "location");
                            let loc = parseInt(locText);
                            if (!isNaN(loc) && locText !== null) {
                                let stars = parseInt(findValueByName(structs[i], "stars"));
                                if (stars > 0) {
                                    aliveMonsters[loc] = true;
                                }
                            }
                        }
                    }

                    let currentServerTime = getCurrentServerTime();

                    for (let i = 0; i < config.allowedMapLocs.length; i++) {
                        let loc = config.allowedMapLocs[i];
                        let terrId = Math.floor(loc / 3);
                        let terr = territories[terrId];
                        
                        if (terr && terr.status === 1) {
                            if (aliveMonsters[loc] === true) {
                                if (currentEnergy > 0 || (config.useBloodstonesMap && currentResources.bloodstones > config.minBloodstonesToSpend)) {
                                    validTargets.push({location: loc, isCave: false});
                                }
                            }
                        }
                    }
                }

                if (validTargets.length === 0) {
                    return { actionTaken: false, isCleared: true, waitTime: 0 }; 
                }

                let target = validTargets[0]; 

                if (target.isCave) {
                    updateGuiAction("Rozpoczynam wyprawę w Jaskini Iluzji!");
                    const xmlStartCave = '<methodCall><methodName>StartIllusionCave</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                    await fetchXmlData(config.url, xmlStartCave);
                } else {
                    updateGuiAction("Atakuję Punkt " + target.location + " na Mapie!");
                    const xmlStartMapFight = '<methodCall><methodName>StartLiberation</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><int>' + target.location + '</int></value></param></params></methodCall>';
                    await fetchXmlData(config.url, xmlStartMapFight);
                }
                
                return { actionTaken: true, isCleared: false, waitTime: 0 }; 

            } catch (error) {
                console.error("Błąd Mapy:", error);
                return { actionTaken: false, isCleared: true, waitTime: 0 }; 
            }
        }

        async function processAdventure(config) {
            const xmlGetAdventures = '<methodCall><methodName>GetAdventures</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
            const xmldata = await fetchXmlData(config.url, xmlGetAdventures);
            const xmlDoc = new DOMParser().parseFromString(xmldata, "text/xml");
            
            // BEZPIECZEŃSTWO: Czasami przygoda trwa w tle i nie lapie jej activeTask, wyciagamy to stąd!
            const runningTime = parseInt(findValueByName(xmlDoc, 'running_adventure_time_remain'));
            if (!isNaN(runningTime) && runningTime > 0) {
                return { startedNow: true, hasRemainingAdventures: false, hasAnotherTaskRunning: true };
            }

            const adventuresMadeToday = parseInt(findValueByName(xmlDoc, 'adventures_made_today'));
            
            if (isNaN(adventuresMadeToday)) {
                return { startedNow: false, hasRemainingAdventures: false, hasAnotherTaskRunning: true };
            }

            const freeAdventuresPerDay = parseInt(findValueByName(xmlDoc, 'free_adventures_per_day')) || 0;
            
            let data = {
                adventures: Array.from(xmlDoc.querySelectorAll('array > data > value > struct')).map(function(adv) {
                    return {
                        difficulty: parseInt(findValueByName(adv, 'difficulty')),
                        gold: parseInt(findValueByName(adv, 'gold')),
                        experience: parseInt(findValueByName(adv, 'exp')),
                        duration: parseInt(findValueByName(adv, 'duration')),
                        id: parseInt(findValueByName(adv, 'quest_id'))
                    };
                }),
                hasRemainingAdventures: adventuresMadeToday < freeAdventuresPerDay,
                hasAnotherTaskRunning: false,
                startedNow: false
            };

            if (!data.hasRemainingAdventures) {
                return data; 
            }

            const maxDifficulty = difficultyMap[config.difficulty];
            const filteredAdventures = data.adventures.filter(function(a) { return a.difficulty <= maxDifficulty; });
            
            if (filteredAdventures.length === 0) return data;

            const bestAdventure = filteredAdventures.reduce(function(max, current) {
                if (config.priorityAdventure === 'gold') {
                    return (current.gold > max.gold) ? current : max;
                } else {
                    return (current.experience > max.experience) ? current : max;
                }
            }, filteredAdventures[0]);

            updateGuiAction("Wysyłam na przygodę...");
            const xmlStartAdventure = '<methodCall><methodName>StartAdventure</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><int>' + bestAdventure.id + '</int></value></param></params></methodCall>';
            await fetchXmlData(config.url, xmlStartAdventure);
            await sleep(1); 
            
            data.startedNow = true;
            return data;
        }

        async function runBotLoop() {
            updateGuiAction("Cykl rozpoczęty. Skanuję status...");
            let adventureCooldown = 0; 

            try {
                while (isBotRunning) {
                    let config = getConfig();

                    let activeTask = await getActiveTask(config);
                    if (activeTask) {
                        let waitTime = activeTask.time + 2;
                        const endTime = Date.now() + (waitTime * 1000);
                        let statusName = (activeTask.type === 'work') ? "PRACA" : "ZADANIE";
                        
                        updateGuiAction("Aktywne zadanie: " + statusName + ". Oczekuję...");
                        adventureCooldown = 0; 
                        
                        while (Date.now() < endTime && isBotRunning) {
                            let tr = Math.ceil((endTime - Date.now()) / 1000);
                            
                            // Mapę zlecamy w tle TYLKO podczas przygody
                            if (activeTask.type !== 'work') {
                                if (tr % 45 === 0 && config.doMap) {
                                    // Puszcza mapę w eter, nie przerywając odliczania przygody!
                                    await processMap(config);
                                }
                            }

                            if (tr % 10 === 0 || tr < 5) {
                                document.getElementById('botStatus').innerText = statusName + " (" + tr + "s)";
                            }
                            await sleep(1);
                        }
                        
                        if (isBotRunning) {
                            if (activeTask.type !== 'work') {
                                updateGuiAction("Odbieram nagrodę za przygodę...");
                                const xmlGetAdvRefresh = '<methodCall><methodName>GetAdventures</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                                await fetchXmlData(config.url, xmlGetAdvRefresh);
                            } else {
                                updateGuiAction("Koniec pracy. Odświeżam stan...");
                                const xmlMiniUpdate = '<methodCall><methodName>MiniUpdate</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param></params></methodCall>';
                                await fetchXmlData(config.url, xmlMiniUpdate);
                            }
                        }
                        continue; 
                    }

                    await processInventory(config);
                    if (!isBotRunning) break;

                    document.getElementById('botStatus').innerText = "SKANOWANIE MAPY";
                    let mapResult = await processMap(config);
                    if (!isBotRunning) break;

                    // Zamiast czekać na Mape TUTAJ, idziemy robic przygody! (Chyba, ze nie ma juz przygód)
                    if (mapResult.actionTaken) {
                        await sleep(1.0); 
                    }
                    
                    await processCircle(config);
                    if (!isBotRunning) break;

                    if (config.spendGoldOn === 'attributes') await processAttributes();
                    if (!isBotRunning) break;
                    
                    let adventureData = { startedNow: false, hasAnotherTaskRunning: false, hasRemainingAdventures: false, skipped: true };
                    
                    let currentResources = await getCurrentResources(config);
                    let canUseStones = (config.useBloodstones && currentResources.bloodstones > config.minBloodstonesToSpend);

                    if (Date.now() >= adventureCooldown || canUseStones) {
                        document.getElementById('botStatus').innerText = "SZUKANIE PRZYGODY";
                        adventureData = await processAdventure(config);
                        adventureData.skipped = false;

                        if (!adventureData.hasAnotherTaskRunning && !adventureData.hasRemainingAdventures && !canUseStones) {
                            adventureCooldown = Date.now() + (5 * 60 * 1000); 
                            updateGuiAction("Wstrzymuję pytania o Przygody (Brak darmowych, bez Karneoli).");
                        }
                    }
                    
                    if (adventureData.startedNow) {
                         continue; 
                    }

                    // TUTA JESTEŚMY TYLKO, GDY NIE MA PRZYGÓD
                    if (!adventureData.hasRemainingAdventures || adventureData.skipped) {
                        
                        if (canUseStones) {
                             updateGuiAction("Pula przygód pusta, ponawiam (Karneol)!");
                             await sleep(2);
                        } else {
                            
                            // Skoro NIE robimy przygody, i mapa fizycznie trwa, TO czekamy na mape!
                            if (!mapResult.isCleared && mapResult.waitTime > 0) {
                                let waitTime = mapResult.waitTime + 2; 
                                updateGuiAction("Trwa walka na mapie. Czekam " + waitTime + "s...");
                                
                                let endTime = Date.now() + (waitTime * 1000);
                                while(Date.now() < endTime && isBotRunning) {
                                    let tr = Math.ceil((endTime - Date.now()) / 1000);
                                    if (tr % 10 === 0 || tr < 5) {
                                        document.getElementById('botStatus').innerText = "WALKA NA MAPIE (" + tr + "s)";
                                    }
                                    await sleep(1);
                                }
                                continue; 
                            }

                            // Jeśli przed chwilą bot uderzył, reset by ponowić atak
                            if (mapResult.actionTaken) {
                                continue;
                            }

                            if (config.doWork && mapResult.isCleared) {
                                updateGuiAction("Mapa wyczyszczona. Rozpoczynam Pracę (" + config.workHours + " godz)!");
                                const xmlStartWork = '<methodCall><methodName>StartWork</methodName><params><param><value><string>' + window.flashvars.sessionID + '</string></value></param><param><value><int>' + config.workHours + '</int></value></param></params></methodCall>';
                                await fetchXmlData(config.url, xmlStartWork);
                                await sleep(2);
                                adventureCooldown = 0; 
                                continue; 
                            }

                            let waitTime = 60 * 5; 
                            const endTime = Date.now() + (waitTime * 1000);
                            updateGuiAction("Tryb spoczynku (5 min). Czekam na resety.");
                            
                            while(Date.now() < endTime && isBotRunning) {
                                let tr = Math.ceil((endTime - Date.now()) / 1000);
                                
                                if (tr % 60 === 0 && config.doMap) {
                                    let bgMapResult = await processMap(config);
                                    if (bgMapResult.actionTaken || (!bgMapResult.isCleared && bgMapResult.waitTime > 0)) {
                                        break; 
                                    }
                                }
                                
                                if (tr % 10 === 0 || tr < 5) {
                                    document.getElementById('botStatus').innerText = "BRAK ZADAŃ (" + tr + "s)";
                                }
                                await sleep(1);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Błąd krytyczny bota:', error);
                let waitTime = 10;
                const endTime = Date.now() + (waitTime * 1000);
                updateGuiAction("Błąd gry. Próba wznowienia...");
                while(Date.now() < endTime && isBotRunning) { 
                    await sleep(1); 
                }
                if(isBotRunning) runBotLoop(); 
            }

            mainBotLoopActive = false;
            const statusEl = document.getElementById('botStatus');
            if(statusEl) {
                statusEl.innerText = "ZATRZYMANY";
                statusEl.style.color = "#ff4444";
                updateGuiAction("Zatrzymano ręcznie.");
            }
        }

        runBotLoop();
    }
})();
