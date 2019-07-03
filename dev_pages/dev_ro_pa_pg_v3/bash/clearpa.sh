pa_array=("1" "2" "3" "4" "8" "9" "13" "14" "15" "16" "17" "18") 
pa_array2=("31" "32" "33" "34" "35" "36" "37" "38" "39" "40" "41" "42" "43" "44" "45" "46")

# making an empty array
pa_array_not_clear=()

## 1. set the prefix
ts_prefix="ts"

## 2. set the source
ts_number=2
ts_number2=8

LOCKED_PA_CT=0

# default value is 1
VALID_DELAY=0

echo Hello World!

for item in ${!pa_array[*]}
    do
        printf "   \n%s\n" "putting TS ${ts_number} into PA: ${pa_array[$item]}" # print each item in the array  
        ret_msg=`curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Authorization: Basic Y25uaWNlbnRyYWw6Y25uaXRhcGU=' "http://quartz-prod2.turner.com/a/destinations?globalName=pa%20${pa_array[$item]}&sourceGlobalName=${ts_prefix}%20${ts_number}"`
        printf "\n Return message:: ${ret_msg} \n"
        #`curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Authorization: Basic Y25uaWNlbnRyYWw6Y25uaXRhcGU=' "http://quartz-prod2.turner.com/a/destinations?globalName=pa%20${pa_array[$item]}&sourceGlobalName=ts%20${ts_number}" -o /dev/null`

        if [[ $ret_msg == *"is locked"* ]] # if the PA is locked"
            then
            # TODO 3/3: need to add spaces after each element in the array
            pa_array_not_clear+="${pa_array[$item]} "
            (( LOCKED_PA_CT++ ))
        fi
        
        # wait <x> seconds
        sleep $VALID_DELAY
    done

printf "\n==========================================================\n"
printf " Done putting TS ${ts_number} into PA 1 - 18 "
printf "\n==========================================================\n\n"

for item in ${!pa_array2[*]}
    do
        printf "   \n%s\n" "putting TS ${ts_number2} into PA: ${pa_array2[$item]}" # print each item in the array  
      
        ret_msg=`curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Authorization: Basic Y25uaWNlbnRyYWw6Y25uaXRhcGU=' "http://quartz-prod2.turner.com/a/destinations?globalName=pa%20${pa_array2[$item]}&sourceGlobalName=${ts_prefix}%20${ts_number2}"`
        printf "\n Return message:: ${ret_msg} \n"
        #`curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Authorization: Basic Y25uaWNlbnRyYWw6Y25uaXRhcGU=' "http://quartz-prod2.turner.com/a/destinations?globalName=pa%20${pa_array2[$item]}&sourceGlobalName=ts%20${ts_number2}" -o /dev/null`

        if [[ $ret_msg == *"is locked"* ]]
            then
            pa_array_not_clear+="${pa_array2[$item]} "
            (( LOCKED_PA_CT++ ))

        fi

        # wait <x> seconds
        sleep $VALID_DELAY
    done

printf "\n==========================================================\n"
printf " Done putting TS ${ts_number2} into PA 31 - 46 "
printf "\n==========================================================\n\n"


if [ $LOCKED_PA_CT -ne 0 ]
    then 
        
        printf "\n Error Error Error Error =================================\n"
        printf " ${LOCKED_PA_CT} PAs were locked \n"

        echo " ${pa_array_not_clear[*]}"

        printf "\n==========================================================\n"
        
fi

