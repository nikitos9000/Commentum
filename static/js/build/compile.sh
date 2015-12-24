#!/bin/sh
closure=~/Toolchain/Closure
java -jar $closure/SoyToJsSrcCompiler.jar --outputPathFormat "./templates/{INPUT_FILE_NAME_NO_EXT}.js" --shouldProvideRequireSoyNamespaces ../../templates/*.soy
python $closure/bin/calcdeps.py -p $closure -p ./ -p ./templates -c $closure/compiler.jar -o compiled -f "--js_output_file=../script_main.js" -f "--formatting=PRETTY_PRINT" -i init.js
python $closure/bin/calcdeps.py -p $closure -p ./ -p ./templates -c $closure/compiler.jar -o compiled -f "--js_output_file=../script_frame.js" -f "--formatting=PRETTY_PRINT" -i frame.js
