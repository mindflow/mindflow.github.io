cd ..
cd coreutiljs
call build.cmd
copy .\target\coreutil-browser.js ..\mindflow.github.io\lib

cd ..
cd xmlparserjs
call build.cmd
copy .\target\xmlparser-browser.js ..\mindflow.github.io\lib

cd ..
cd justrightjs
call build.cmd
copy .\target\justright-browser.js ..\mindflow.github.io\lib

cd ..
cd mindflow.github.io