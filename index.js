const chokidar = require("chokidar");
const { execSync, exec } = require("child_process");

const gitIsClean = () => {
  const res = execSync("git status -s").toString();
  return res.length > 0 ? false : true;
};

const autoCommitPush = (msg) => {
  const commitMsg = msg || "*******当前工作区存在内容，即将自动提交*******";
  console.log(commitMsg);
  execSync(`git add .`);
  execSync(`git commit -m ${commitMsg}`);
  gitPush(commitMsg);
};

const gitPush = (commitMsg) => {
  exec("git push", (error, stdout, stderr) => {
    if (error) {
      console.log(`******* push error *******`);
      console.log("error:", error);
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      console.log(`******* push error *******`);
      return;
    }
    console.log(`${new Date().toLocaleString()}，更新成功：${commitMsg}！`);
  });
};

(function main() {
  if (!gitIsClean()) {
    autoCommitPush();
  }
  chokidar.watch(["./"]).on("all", (eventname, path) => {
    try {
      if (gitIsClean()) {
        return;
      }
      const commitMsg = eventname + ":" + path;
      autoCommitPush(commitMsg);
    } catch (error) {
      console.log("error", error);
    }
  });
})();
