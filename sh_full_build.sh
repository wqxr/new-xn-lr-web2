#!/bin/bash

getTiming() {
    start=$1
    end=$2
    start_s=$(echo $start | cut -d '.' -f 1)
    start_ns=$(echo $start | cut -d '.' -f 2)
    end_s=$(echo $end | cut -d '.' -f 1)
    end_ns=$(echo $end | cut -d '.' -f 2)
    time=$(( ( 10#$end_s - 10#$start_s ) * 1000 + ( 10#$end_ns / 1000000 - 10#$start_ns / 1000000 ) ))
    echo "$time ms"
}

tt() {
    echo $(date +%Y-%m-%d%t%T)
}

echo 从git拉取最新版本的代码 $(tt)
git pull
git submodule update


case "$1" in
	full)
		start1=$(date +%s.%N)
		echo 更新依赖库 $(tt)
		npm install
		start2=$(date +%s.%N)
		echo 更新依赖库时间：$(getTiming $start1 $start2)
		echo 编译 $(tt)
		npm run build
		start3=$(date +%s.%N)
		echo 编译时间：$(getTiming $start2 $start3)
		echo 编译完成 $(tt)
		;;
	test)
		start1=$(date +%s.%N)
		echo test::更新依赖库 $(tt)
		sleep 1
		start2=$(date +%s.%N)
		echo  test::更新依赖库 $(getTiming $start1 $start2)
		echo test::编译 $(tt)
		sleep 2
		start3=$(date +%s.%N)
		echo test::编译 $(getTiming $start2 $start3)
		echo test::编译完成 $(tt)
		;;

    rexbuild)
		start2=$(date +%s.%N)
		echo 编译 $(tt)
		npm run rexbuild
		start3=$(date +%s.%N)
		echo 编译时间：$(getTiming $start2 $start3)
		echo 编译完成 $(tt)
		;;
    help)
        echo "Usage: $0  [full | help | rexbuild | test]"
        exit 1
        ;;
	*)
		start2=$(date +%s.%N)
		echo 编译 $(tt)
		npm run build
		start3=$(date +%s.%N)
		echo 编译时间：$(getTiming $start2 $start3)
		echo 编译完成 $(tt)
		;;
esac
