const $=id=>document.getElementById(id);
const KEY='tejas_portal_demo_v1';
let state=JSON.parse(localStorage.getItem(KEY)||'null')||{
 students:[{id:'TI1001',name:'Demo Student',password:'student123',className:'Class 10'}],
 exams:[{id:'EX1',title:'Class 10 Science Demo',className:'Class 10',subject:'Science',duration:60,perMark:1,negative:.25,questions:[
 {q:'Which gas is most abundant in Earth’s atmosphere?',opts:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],a:1},
 {q:'What is the SI unit of force?',opts:['Joule','Watt','Newton','Pascal'],a:2}
 ]}],
 results:[]
};
let currentUser=null,activeExam=null,answers=[],reviews=[],currentQ=0,remaining=0,timerHandle=null,language='en',lastResult=null;
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function show(id){['loginView','adminView','studentView','examView','resultView'].forEach(x=>$(x).classList.toggle('hidden',x!==id));}
function classes(){return Array.from({length:12},(_,i)=>`<option>Class ${i+1}</option>`).join('')}
$('studentClass').innerHTML=classes();
$('loginForm').addEventListener('submit',e=>{e.preventDefault();const id=$('userId').value.trim(),pw=$('password').value;
 if(id==='admin'&&pw==='Tejas@123'){renderAdmin();show('adminView');return}
 const s=state.students.find(x=>x.id===id&&x.password===pw);if(!s){alert('Invalid ID or password');return}currentUser=s;renderStudent();show('studentView');});
$('logoutAdmin').onclick=$('logoutStudent').onclick=()=>{clearInterval(timerHandle);currentUser=null;activeExam=null;show('loginView')};
function renderAdmin(){ $('studentCount').textContent=state.students.length;$('examCount').textContent=state.exams.length;$('resultCount').textContent=state.results.length;
 $('questionExam').innerHTML=state.exams.map(e=>`<option value="${e.id}">${esc(e.title)}</option>`).join('');
 $('examList').innerHTML=state.exams.map(e=>`<div class="exam-item"><div><b>${esc(e.title)}</b><p>${e.className} · ${esc(e.subject)} · ${e.duration} min · ${e.questions.length} questions</p></div><span class="badge">${e.questions.length?'Ready':'No questions'}</span></div>`).join('')||'<p class="muted">No exams created yet.</p>';
 $('studentList').innerHTML=state.students.map(s=>`<div class="list-item"><span><b>${esc(s.name)}</b><br><small>${esc(s.id)} · ${s.className}</small></span></div>`).join('');
 updateQCount();}
function updateQCount(){const e=state.exams.find(x=>x.id===$('questionExam').value);$('questionCount').textContent=e?`${e.questions.length} question(s) added`:'Create an exam first';}
$('examForm').onsubmit=e=>{e.preventDefault();const exam={id:'EX'+Date.now(),title:$('examTitle').value.trim(),className:$('examClass').value,subject:$('examSubject').value.trim(),duration:+$('duration').value,perMark:+$('perMark').value,negative:+$('negative').value,questions:[]};state.exams.push(exam);save();e.target.reset();renderAdmin();};
$('questionExam').onchange=updateQCount;
$('questionForm').onsubmit=e=>{e.preventDefault();const exam=state.exams.find(x=>x.id===$('questionExam').value);if(!exam)return alert('Select an exam');exam.questions.push({q:$('questionText').value.trim(),opts:[$('optA').value,$('optB').value,$('optC').value,$('optD').value],a:+$('correct').value});save();e.target.reset();renderAdmin();};
$('studentForm').onsubmit=e=>{e.preventDefault();const id=$('studentNewId').value.trim();if(state.students.some(s=>s.id===id))return alert('Student ID already exists');state.students.push({id,name:$('studentName').value.trim(),password:$('studentNewPassword').value,className:$('studentClass').value});save();e.target.reset();renderAdmin();};
function renderStudent(){$('studentWelcome').textContent='Welcome, '+currentUser.name;$('studentClassLabel').textContent=currentUser.className;
 const available=state.exams.filter(e=>e.className===currentUser.className);$('availableExams').innerHTML=available.map(e=>`<div class="exam-item"><div><b>${esc(e.title)}</b><p>${esc(e.subject)} · ${e.questions.length} questions · ${e.duration} minutes</p></div><button class="primary" ${e.questions.length?'':'disabled'} onclick="startExam('${e.id}')">Start</button></div>`).join('')||'<p class="muted">No exams available for your class.</p>';
 const mine=state.results.filter(r=>r.studentId===currentUser.id);$('myResults').innerHTML=mine.map(r=>`<div class="list-item"><span><b>${esc(r.examTitle)}</b><br><small>${new Date(r.date).toLocaleString()}</small></span><b>${r.score}/${r.total}</b></div>`).join('')||'<p class="muted">No results yet.</p>';}
window.startExam=id=>{activeExam=state.exams.find(e=>e.id===id);if(!activeExam||!activeExam.questions.length)return; if(state.results.some(r=>r.examId===id&&r.studentId===currentUser.id))return alert('You have already submitted this exam.');if(!confirm(`Start ${activeExam.title}? Timer starts immediately.`))return;answers=Array(activeExam.questions.length).fill(null);reviews=Array(activeExam.questions.length).fill(false);currentQ=0;remaining=activeExam.duration*60;$('examHeading').textContent=activeExam.title;$('examMeta').textContent=`${activeExam.className} · ${activeExam.subject}`;show('examView');renderQuestion();startTimer();};
function startTimer(){clearInterval(timerHandle);tick();timerHandle=setInterval(tick,1000);}
function tick(){const m=Math.floor(remaining/60),s=remaining%60;$('timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(remaining<=0){clearInterval(timerHandle);finishExam(true);return}remaining--;}
function renderQuestion(){const q=activeExam.questions[currentQ];$('questionNumber').textContent=`Question ${currentQ+1} of ${activeExam.questions.length}`;$('liveQuestion').textContent=q.q;$('liveOptions').innerHTML=q.opts.map((o,i)=>`<label class="option ${answers[currentQ]===i?'selected':''}"><input type="radio" name="answer" value="${i}" ${answers[currentQ]===i?'checked':''}><b>${'ABCD'[i]}.</b> ${esc(o)}</label>`).join('');
 document.querySelectorAll('input[name="answer"]').forEach(el=>el.onchange=()=>{answers[currentQ]=+el.value;renderQuestion();});
 $('answeredLabel').textContent=`Answered ${answers.filter(x=>x!==null).length}`;$('progressBar').style.width=(answers.filter(x=>x!==null).length/answers.length*100)+'%';$('reviewBtn').textContent=reviews[currentQ]?'★ Remove review':'☆ Mark for review';
 $('palette').innerHTML=answers.map((a,i)=>`<button class="${a!==null?'answered':''} ${reviews[i]?'review':''}" onclick="goQuestion(${i})">${i+1}</button>`).join('');$('previousBtn').disabled=currentQ===0;}
window.goQuestion=i=>{currentQ=i;renderQuestion()};
$('previousBtn').onclick=()=>{if(currentQ>0){currentQ--;renderQuestion()}};
$('saveNextBtn').onclick=()=>{if(currentQ<activeExam.questions.length-1){currentQ++;renderQuestion()}else alert('Last question. Review your answers or submit the exam.');};
$('reviewBtn').onclick=()=>{reviews[currentQ]=!reviews[currentQ];renderQuestion()};
$('submitExam').onclick=()=>{const unanswered=answers.filter(x=>x===null).length;if(confirm(`Submit exam? ${unanswered} question(s) unanswered.`))finishExam(false);};
function finishExam(auto){clearInterval(timerHandle);let correct=0,wrong=0,unattempted=0;activeExam.questions.forEach((q,i)=>{if(answers[i]===null)unattempted++;else if(answers[i]===q.a)correct++;else wrong++;});const score=correct*activeExam.perMark-wrong*activeExam.negative,total=activeExam.questions.length*activeExam.perMark;
 const result={studentId:currentUser.id,studentName:currentUser.name,className:currentUser.className,examId:activeExam.id,examTitle:activeExam.title,correct,wrong,unattempted,score,total,date:new Date().toISOString(),auto};state.results.push(result);save();lastResult=result;renderResult(result);show('resultView');}
function renderResult(r){$('resultContent').innerHTML=`<h2>${esc(r.studentName)}</h2><p class="muted">${esc(r.className)} · ${esc(r.examTitle)}</p><div class="score">${Number(r.score.toFixed(2))} / ${r.total}</div><div class="result-grid"><div><b>${r.correct}</b><small>Correct</small></div><div><b>${r.wrong}</b><small>Incorrect</small></div><div><b>${r.unattempted}</b><small>Unattempted</small></div></div><p><b>Percentage:</b> ${(r.score/r.total*100).toFixed(2)}%</p><p class="tiny muted">Rank is calculated among submitted students for this exam in the admin CSV report. ${r.auto?'Automatically submitted when time ended.':''}</p>`;}
$('downloadResult').onclick=()=>window.print();$('backToStudent').onclick=()=>{renderStudent();show('studentView')};
$('exportBtn').onclick=()=>{const rows=[['Student ID','Student Name','Class','Exam','Correct','Wrong','Unattempted','Score','Total','Date'],...state.results.map(r=>[r.studentId,r.studentName,r.className,r.examTitle,r.correct,r.wrong,r.unattempted,r.score,r.total,r.date])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='tejas-results.csv';a.click();URL.revokeObjectURL(a.href);};
$('langBtn').onclick=()=>{language=language==='en'?'hi':'en';$('langBtn').textContent=language==='en'?'हिंदी':'English';document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset[language]);};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
                                                                                                                                                                                                                                                                      
