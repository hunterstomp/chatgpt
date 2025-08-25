// scripts/cases-set.mjs
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const CASE_DIR = path.join(process.cwd(), "src", "pages", "case-studies");

function parseFrontmatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { front:{}, body:txt };
  const frontRaw = m[1];
  const front = {};
  for (const line of frontRaw.split("\n")) {
    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!kv) continue;
    const key = kv[1]; let val = kv[2].trim();
    if ((val.startsWith('"')&&val.endsWith('"'))||(val.startsWith("'")&&val.endsWith("'"))) val=val.slice(1,-1);
    front[key]=val;
  }
  const head=m[0]; const body=txt.slice(head.length);
  return { front, body };
}

function setStatusContent(txt,newStatus){
  const {front,body}=parseFrontmatter(txt);
  const next={...front,status:newStatus};
  const lines=[];
  for(const [k,v] of Object.entries(next)){
    lines.push(`${k}: ${/\s/.test(v)?`"${v}"`:v}`);
  }
  return `---\n${lines.join("\n")}\n---\n${body}`;
}

function listFiles(){
  return fs.readdirSync(CASE_DIR).filter(f=>f.endsWith(".md")).sort();
}

function updateFile(f,newStatus){
  const p=path.join(CASE_DIR,f);
  const txt=fs.readFileSync(p,"utf-8");
  const upd=setStatusContent(txt,newStatus);
  fs.writeFileSync(p,upd,"utf-8");
  console.log(`→ ${f}  status: ${newStatus}`);
}

const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const files=listFiles();
let i=0;
console.log("Prompt mode. [p]=published, [d]=draft, [h]=hidden, [s]=skip, [q]=quit\n");
function loop(){
  if(i>=files.length){ rl.close(); return; }
  const f=files[i++];
  const p=path.join(CASE_DIR,f);
  const {front}=parseFrontmatter(fs.readFileSync(p,"utf-8"));
  const status=(front.status||"draft").toLowerCase();
  rl.question(`${f} (${front.title||f}) [${status}] → (p/d/h/s/q): `,(ans)=>{
    const a=(ans||"").trim().toLowerCase();
    if(a==="q"){ rl.close(); return; }
    if(a==="p"||a==="d"||a==="h"){
      const ns=a==="p"?"published":a==="d"?"draft":"hidden";
      updateFile(f,ns);
    }
    loop();
  });
}
loop();
