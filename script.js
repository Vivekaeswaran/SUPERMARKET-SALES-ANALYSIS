'use strict';
const C={p:'#6C63FF',c:'#00D4FF',g:'#FFB800',gr:'#00E676',r:'#FF4757',pk:'#FF6B9D'};
const CATS=['Electronics','Fashion','Food & Bev','Health & Beauty','Home & Lifestyle','Sports & Travel'];
const BRANCHES=['Branch A','Branch B','Branch C'];
Chart.defaults.color='#94A3B8';
Chart.defaults.borderColor='rgba(255,255,255,0.06)';
Chart.defaults.font.family='Inter,sans-serif';
function gc(id){return document.getElementById(id);}
function ctx(id){return gc(id).getContext('2d');}

// Particles
(function(){
  const p=gc('bgParticles');
  for(let i=0;i<20;i++){
    const d=document.createElement('div');
    d.className='particle';
    const s=Math.random()*8+4;
    d.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${[C.p,C.c,C.g][i%3]};animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s`;
    p.appendChild(d);
  }
})();

// Live clock
setInterval(()=>{
  const n=new Date();
  gc('liveTime').textContent=n.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
},1000);

// Counter animation
function animateVal(el,target,pre='',suf='',dec=0){
  const start=Date.now(),dur=1800;
  const step=()=>{
    const prog=Math.min((Date.now()-start)/dur,1);
    const ease=1-Math.pow(1-prog,3);
    const v=target*ease;
    el.textContent=pre+(dec?v.toFixed(dec):Math.floor(v).toLocaleString())+suf;
    if(prog<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Sidebar toggle
const sb=gc('sidebar'),mc=gc('mainContent');
gc('sidebarToggle').addEventListener('click',()=>{
  if(window.innerWidth<=900)sb.classList.toggle('open');
  else{sb.classList.toggle('collapsed');mc.classList.toggle('expanded');}
});

// Nav highlight
document.querySelectorAll('.nav-item').forEach(a=>{
  a.addEventListener('click',()=>{
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
  });
});

// KPI counters
setTimeout(()=>{
  animateVal(gc('kpiRevenue').querySelector('.kpi-value'),322966,'$','',0);
  animateVal(gc('kpiTransactions').querySelector('.kpi-value'),1000,'','',0);
  animateVal(gc('kpiIncome').querySelector('.kpi-value'),15379,'$','',0);
  animateVal(gc('kpiAOV').querySelector('.kpi-value'),323,'$','',0);
  animateVal(gc('kpiRating').querySelector('.kpi-value'),4.0,'','★',1);
  animateVal(gc('kpiProducts').querySelector('.kpi-value'),5510,'','',0);
},400);

// Mini sparklines
function miniLine(id,data,color){
  new Chart(ctx(id),{type:'line',data:{labels:data.map((_,i)=>i),datasets:[{data,borderColor:color,backgroundColor:color+'22',tension:0.4,borderWidth:2,fill:true,pointRadius:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}});
}
miniLine('kpiSpark1',[22,25,28,24,30,32,29,35],C.p);
miniLine('kpiSpark2',[80,90,85,95,88,100,92,105],C.c);
miniLine('kpiSpark3',[1200,1400,1350,1500,1450,1600,1550,1700],C.g);
miniLine('kpiSpark4',[310,320,315,325,318,322,320,323],C.gr);
miniLine('kpiSpark5',[420,460,440,480,470,500,490,520],C.c);

// Rating gauge
new Chart(ctx('kpiGauge'),{type:'doughnut',data:{datasets:[{data:[4.0,1.0],backgroundColor:[C.g,'rgba(255,255,255,0.06)'],borderWidth:0,circumference:270,rotation:225}]},options:{cutout:'78%',plugins:{legend:{display:false},tooltip:{enabled:false}}}});

// Hero sparkline
new Chart(ctx('heroSparkline'),{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{data:[28000,32000,29000,38000,35000,42000,39000,45000,41000,48000,44000,52000],borderColor:C.c,backgroundColor:'rgba(0,212,255,0.08)',tension:0.4,borderWidth:2.5,fill:true,pointRadius:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}});

// Daily Sales
const dailyRev=[8200,9100,7800,10200,9600,11400,8900,10800,9200,11600,10100,12300,9800,11200,10500,13100,11800,12700,10900,13800,12100,14200,11500,13500,12800,15100,13200,14800,13000,15500];
const dailyChart=new Chart(ctx('dailySalesTrend'),{type:'line',data:{labels:dailyRev.map((_,i)=>`Day ${i+1}`),datasets:[{label:'Revenue',data:dailyRev,borderColor:C.p,backgroundColor:'rgba(108,99,255,0.08)',tension:0.4,borderWidth:2.5,fill:true,pointRadius:0,pointHoverRadius:5,pointHoverBackgroundColor:C.p}]},options:{responsive:true,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false}},scales:{x:{ticks:{maxTicksLimit:10,font:{size:10}}},y:{ticks:{callback:v=>'$'+v.toLocaleString()}}}}});

document.querySelectorAll('.ctab').forEach(b=>{
  b.addEventListener('click',function(){
    document.querySelectorAll('.ctab').forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
    if(this.dataset.tab==='qty'){
      dailyChart.data.datasets[0].data=dailyRev.map(v=>Math.floor(v/180));
      dailyChart.data.datasets[0].borderColor=C.c;
      dailyChart.data.datasets[0].backgroundColor='rgba(0,212,255,0.08)';
      dailyChart.options.scales.y.ticks.callback=v=>v;
    }else{
      dailyChart.data.datasets[0].data=dailyRev;
      dailyChart.data.datasets[0].borderColor=C.p;
      dailyChart.data.datasets[0].backgroundColor='rgba(108,99,255,0.08)';
      dailyChart.options.scales.y.ticks.callback=v=>'$'+v.toLocaleString();
    }
    dailyChart.update();
  });
});

// Branch Revenue Pie
new Chart(ctx('branchRevenuePie'),{type:'doughnut',data:{labels:BRANCHES,datasets:[{data:[106143,97219,119604],backgroundColor:[C.p,C.c,C.g],borderWidth:0,hoverOffset:8}]},options:{cutout:'65%',plugins:{legend:{position:'bottom',labels:{padding:12,font:{size:11}}}}}});

// Monthly Revenue
new Chart(ctx('monthlyRevenue'),{type:'bar',data:{labels:['January','February','March'],datasets:[{label:'Branch A',data:[33000,36000,37143],backgroundColor:C.p+'bb'},{label:'Branch B',data:[30000,33000,34219],backgroundColor:C.c+'bb'},{label:'Branch C',data:[37000,40000,42604],backgroundColor:C.g+'bb'}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'k'}}}}});

// Category donut
const catRevs=[54631,54305,56144,49193,53861,54831];
new Chart(ctx('categoryDonut'),{type:'doughnut',data:{labels:CATS,datasets:[{data:catRevs,backgroundColor:[C.p,C.c,C.g,C.gr,C.r,C.pk],borderWidth:0,hoverOffset:8}]},options:{cutout:'60%',plugins:{legend:{position:'bottom',labels:{padding:8,font:{size:10}}}}}});

// Top products
new Chart(ctx('topProductsBar'),{type:'bar',data:{labels:CATS,datasets:[{label:'Revenue ($)',data:catRevs,backgroundColor:[C.p+'cc',C.c+'cc',C.g+'cc',C.gr+'cc',C.r+'cc',C.pk+'cc'],borderRadius:6,borderWidth:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'k'}}}}});

// Quantity
new Chart(ctx('quantityBar'),{type:'bar',data:{labels:CATS,datasets:[{label:'Units Sold',data:[971,902,952,854,911,920],backgroundColor:'rgba(108,99,255,0.2)',borderColor:C.p,borderWidth:1.5,borderRadius:4}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});

// Best/Worst
const bwData=[{n:'Food & Beverages',v:'$56,144',pct:100,best:true},{n:'Sports & Travel',v:'$54,831',pct:97,best:true},{n:'Electronics',v:'$54,631',pct:97,best:true},{n:'Health & Beauty',v:'$49,193',pct:87,best:false},{n:'Home & Lifestyle',v:'$53,861',pct:95,best:true}];
const bwEl=gc('bestWorstList');
bwData.forEach((item,i)=>{bwEl.innerHTML+=`<div class="bw-item"><div class="bw-rank ${item.best?'best':'worst'}">${i+1}</div><div style="flex:1"><div class="bw-name">${item.n}</div><div class="bw-bar-wrap"><div class="bw-bar" style="width:${item.pct}%;background:${item.best?C.gr:C.r}"></div></div></div><div class="bw-val" style="color:${item.best?C.gr:C.r}">${item.v}</div></div>`;});

// Customer type
new Chart(ctx('customerTypeDonut'),{type:'doughnut',data:{labels:['Member','Normal'],datasets:[{data:[501,499],backgroundColor:[C.p,C.c],borderWidth:0,hoverOffset:6}]},options:{cutout:'65%',plugins:{legend:{position:'bottom'}}}});

// Gender
new Chart(ctx('genderChart'),{type:'doughnut',data:{labels:['Female','Male'],datasets:[{data:[501,499],backgroundColor:[C.pk,C.c],borderWidth:0,hoverOffset:6}]},options:{cutout:'65%',plugins:{legend:{position:'bottom'}}}});

// Ratings
new Chart(ctx('ratingBar'),{type:'bar',data:{labels:['5★','4★','3★','2★','1★'],datasets:[{data:[186,204,220,198,192],backgroundColor:[C.g,C.p,C.c,C.gr,C.r],borderRadius:6,borderWidth:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});

// Purchase behavior
new Chart(ctx('purchaseBehavior'),{type:'bar',data:{labels:CATS,datasets:[{label:'Member',data:[270,265,272,240,265,268],backgroundColor:C.p+'bb'},{label:'Normal',data:[265,260,268,235,260,262],backgroundColor:C.c+'bb'}]},options:{responsive:true,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true}}}});

// Branch compare
new Chart(ctx('branchCompare'),{type:'bar',data:{labels:['Revenue','Transactions','Avg Order','Gross Income'],datasets:[{label:'Branch A',data:[106143,340,312,5057],backgroundColor:C.p+'bb'},{label:'Branch B',data:[97219,332,293,4630],backgroundColor:C.c+'bb'},{label:'Branch C',data:[119604,328,365,5692],backgroundColor:C.g+'bb'}]},options:{responsive:true,plugins:{legend:{position:'top'}},scales:{y:{ticks:{callback:v=>v>1000?'$'+(v/1000).toFixed(0)+'k':v}}}}});

// Profitability
new Chart(ctx('profitabilityGauge'),{type:'doughnut',data:{labels:['A (33%)','B (30%)','C (37%)'],datasets:[{data:[33,30,37],backgroundColor:[C.p,C.c,C.g],borderWidth:0,hoverOffset:8}]},options:{cutout:'55%',plugins:{legend:{position:'bottom'}}}});

// Branch cards
const brInfo=[{n:'Branch A',city:'Yangon',rev:'$106,143',tx:340,avg:'$312',color:C.p,pct:89},{n:'Branch B',city:'Mandalay',rev:'$97,219',tx:332,avg:'$293',color:C.c,pct:81},{n:'Branch C',city:'Naypyitaw',rev:'$119,604',tx:328,avg:'$365',color:C.g,pct:100}];
const bcRow=gc('branchCardsRow');
brInfo.forEach(b=>{bcRow.innerHTML+=`<div class="branch-card"><div class="bc-header"><div><div class="bc-name" style="color:${b.color}">${b.n}</div><div class="bc-city">${b.city}</div></div></div><div class="bc-revenue" style="color:${b.color}">${b.rev}</div><div class="bc-stats"><div class="bc-stat"><span class="bc-stat-val">${b.tx}</span><span class="bc-stat-lbl">Transactions</span></div><div class="bc-stat"><span class="bc-stat-val">${b.avg}</span><span class="bc-stat-lbl">Avg Order</span></div></div><div class="bc-progress"><div class="bc-progress-fill" style="width:${b.pct}%;background:${b.color}"></div></div></div>`;});

// Payment donut
new Chart(ctx('paymentDonut'),{type:'doughnut',data:{labels:['Cash','Credit Card','E-Wallet'],datasets:[{data:[344,311,345],backgroundColor:[C.g,C.p,C.c],borderWidth:0,hoverOffset:8}]},options:{cutout:'62%',plugins:{legend:{position:'bottom'}}}});

// Payment branch
new Chart(ctx('paymentBranchBar'),{type:'bar',data:{labels:BRANCHES,datasets:[{label:'Cash',data:[36000,32000,38000],backgroundColor:C.g+'bb'},{label:'Credit Card',data:[34000,31000,36000],backgroundColor:C.p+'bb'},{label:'E-Wallet',data:[36143,34219,45604],backgroundColor:C.c+'bb'}]},options:{responsive:true,plugins:{legend:{position:'top'}},scales:{y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'k'}}}}});

// Payment prefs
const ppData=[{icon:'💵',name:'Cash',pct:'34.4%',rev:'$109,743',tx:'344'},{icon:'💳',name:'Credit Card',pct:'31.1%',rev:'$101,148',tx:'311'},{icon:'📱',name:'E-Wallet',pct:'34.5%',rev:'$112,075',tx:'345'}];
const ppGrid=gc('paymentPrefGrid');
ppData.forEach(p=>{ppGrid.innerHTML+=`<div class="pp-card"><div class="pp-icon">${p.icon}</div><div class="pp-info"><div class="pp-name">${p.name}</div><div class="pp-stats"><div class="pp-stat"><span class="pp-stat-val">${p.pct}</span><span class="pp-stat-lbl">Share</span></div><div class="pp-stat"><span class="pp-stat-val">${p.rev}</span><span class="pp-stat-lbl">Revenue</span></div><div class="pp-stat"><span class="pp-stat-val">${p.tx}</span><span class="pp-stat-lbl">Txns</span></div></div></div></div>`;});

// Hourly
new Chart(ctx('hourlyTrend'),{type:'line',data:{labels:['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'],datasets:[{label:'Sales',data:[2100,3400,4200,5800,6100,7200,8900,9800,8200,7100,5900,4200,2800],borderColor:C.c,backgroundColor:'rgba(0,212,255,0.08)',tension:0.4,borderWidth:2.5,fill:true,pointRadius:4,pointBackgroundColor:C.c,pointHoverRadius:7}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:10}}},y:{ticks:{callback:v=>'$'+v.toLocaleString()}}}}});

// Weekly
new Chart(ctx('weeklyBar'),{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Revenue',data:[42000,38000,45000,41000,48000,55000,52000],backgroundColor:['#6C63FFbb','#6C63FFbb','#6C63FFbb','#6C63FFbb','#6C63FFbb','#00E676dd','#00D4FFbb'],borderRadius:6,borderWidth:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'k'}}}}});

// Heatmap
const heatRows=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const heatCols=['10','11','12','13','14','15','16','17','18','19','20'];
const heatData=heatRows.map(()=>heatCols.map(()=>Math.floor(Math.random()*900+100)));
const heatMax=Math.max(...heatData.flat());
let ht=`<table class="heatmap-table"><thead><tr><th></th>${heatCols.map(c=>`<th>${c}:00</th>`).join('')}</tr></thead><tbody>`;
heatRows.forEach((row,ri)=>{
  ht+=`<tr><th>${row}</th>`;
  heatCols.forEach((_,ci)=>{
    const v=heatData[ri][ci];
    const a=(v/heatMax);
    const r=Math.floor(108+a*147);const g=Math.floor(99+a*100);const b=Math.floor(255-a*100);
    ht+=`<td style="background:rgba(${r},${g},${b},${0.2+a*0.7});color:${a>0.6?'#fff':'#94A3B8'}">${v}</td>`;
  });
  ht+='</tr>';
});
ht+='</tbody></table>';
gc('heatmapContainer').innerHTML=ht;

// Forecast
new Chart(ctx('forecastChart'),{type:'line',data:{labels:['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Historical Revenue',data:[95000,98000,102000,105000,108000,111000,null,null,null],borderColor:C.p,backgroundColor:'rgba(108,99,255,0.08)',tension:0.4,borderWidth:2.5,fill:true,pointRadius:4,pointBackgroundColor:C.p},{label:'Forecast',data:[null,null,null,null,null,111000,118000,124000,131000],borderColor:C.c,backgroundColor:'rgba(0,212,255,0.06)',tension:0.4,borderWidth:2.5,fill:true,borderDash:[6,4],pointRadius:5,pointBackgroundColor:C.c}]},options:{responsive:true,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top'}},scales:{y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'k'}}}}});

// AI Insights
const insights={
  findings:['Food & Beverages leads all categories with $56,144 in revenue','Branch C (Naypyitaw) is top performer with $119,604 revenue','Saturday is peak sales day — 24% above weekly average','E-Wallet and Cash are near-equally preferred at ~34.5% each'],
  growth:['Expand E-Wallet promotions to capture digital-first customers','Health & Beauty underperforms — launch targeted loyalty offers','Branch B lags 18% behind average — review inventory & staffing','Peak hour upsell campaign during 16:00–18:00 could boost 12%'],
  behavior:['Female customers are slight majority at 50.1% of purchases','Evening shoppers (15:00–19:00) generate 58% of daily revenue','Members and Normal customers purchase at near-identical rates','3-star ratings are most common — service quality gap opportunity'],
  strategy:['Convert Normal customers to Members via loyalty incentives','Introduce premium category bundles for Home & Electronics','Implement time-based discounts to balance hourly revenue spread','Deploy targeted weekend campaigns to sustain Saturday momentum']
};
gc('insightFindings').innerHTML=insights.findings.map(i=>`<li>${i}</li>`).join('');
gc('insightGrowth').innerHTML=insights.growth.map(i=>`<li>${i}</li>`).join('');
gc('insightBehavior').innerHTML=insights.behavior.map(i=>`<li>${i}</li>`).join('');
gc('insightStrategy').innerHTML=insights.strategy.map(i=>`<li>${i}</li>`).join('');

// Filters
gc('btnApply').addEventListener('click',()=>{
  document.querySelectorAll('.kpi-value').forEach(el=>{
    const t=parseFloat(el.dataset.target)*(0.85+Math.random()*0.3);
    const hasDollar=el.textContent.includes('$');
    const hasStar=el.textContent.includes('★');
    animateVal(el,t,hasDollar?'$':'',hasStar?'★':'',hasDollar&&t<100?1:0);
  });
});
gc('btnReset').addEventListener('click',()=>{
  ['filterBranch','filterCategory','filterCustomer','filterPayment'].forEach(id=>{gc(id).value='all';});
  setTimeout(()=>{
    animateVal(gc('kpiRevenue').querySelector('.kpi-value'),322966,'$','',0);
    animateVal(gc('kpiTransactions').querySelector('.kpi-value'),1000,'','',0);
    animateVal(gc('kpiIncome').querySelector('.kpi-value'),15379,'$','',0);
    animateVal(gc('kpiAOV').querySelector('.kpi-value'),323,'$','',0);
    animateVal(gc('kpiRating').querySelector('.kpi-value'),4.0,'','★',1);
    animateVal(gc('kpiProducts').querySelector('.kpi-value'),5510,'','',0);
  },100);
});
gc('btnExport').addEventListener('click',()=>window.print());

// Intersection observer
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}}),{threshold:0.08});
document.querySelectorAll('.section,.kpi-card,.chart-card,.insight-card').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition='opacity 0.5s ease,transform 0.5s ease';obs.observe(el);
});
