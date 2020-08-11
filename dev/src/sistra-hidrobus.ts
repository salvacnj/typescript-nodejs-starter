


function parseTCPresponse(msg){
    console.log("PARSING TCP" + msg);
    let recv_json = JSON.parse(msg.toString('utf8'));
    if (recv_json.b.eva[0]== "0") recv_json.b.eva[0] = 0;
    if (recv_json.b.eva[0]== "1") recv_json.b.eva[0] = 100;
    if (recv_json.b.eva[1]== "0") recv_json.b.eva[1] = 0;
    if (recv_json.b.eva[1]== "1") recv_json.b.eva[1] = 100;
    if (recv_json.b.eva[2]== "0") recv_json.b.eva[2] = 0;
    if (recv_json.b.eva[2]== "1") recv_json.b.eva[2] = 100;
    if (recv_json.b.eva[3]== "0") recv_json.b.eva[3] = 0;
    if (recv_json.b.eva[3]== "1") recv_json.b.eva[3] = 100;
    return JSON.stringify(recv_json);
}
  ​
  ​
  function updateVS(data, msg){
    data = JSON.parse(msg.replace(/'/g, '"'));
    data.HIST.DATA.VS1 = number2OnOff(msg.b.vs[0]);
    data.HIST.DATA.VS2 = number2OnOff(msg.b.vs[1]);
    data.HIST.DATA.VS3 = number2OnOff(msg.b.vs[2]);
    data.HIST.DATA.VS4 = number2OnOff(msg.b.vs[3]);
    return JSON.stringify(data);
  }
  ​
  ​
  function transforString(topic, msg){
    var serial_number, result;
    try {
        msg = JSON.parse(msg.replace(/'/g, '"'));
        topic = topic.split("/");
        serial_number = topic[2];
        result = {
            "HIST":{
                "VERSION":"0.01",
                "IMEI": serial_number,
                "DATA":{
                "ID_MOD":"b",
                "C1":msg.b.c[0],
                "C2":msg.b.c[1],
                "C3":msg.b.c[2],
                "C4":msg.b.c[3],
                "AR1":msg.b.ar[0],
                "AR2":msg.b.ar[1],
                "CA1":msg.b.ca[0],
                "CA2":msg.b.ca[1],
                "CA3":msg.b.ca[2],
                "CA4":msg.b.ca[3],
                "VS1":number2OnOff(msg.b.vs[0]),
                "VS2":number2OnOff(msg.b.vs[1]),
                "VS3":number2OnOff(msg.b.vs[2]),
                "VS4":number2OnOff(msg.b.vs[3]),
                "RS":msg.b.rs,
                "BACKOFF":msg.b.dg[0],
                "ATTACH":msg.b.dg[1],
                "RESET_SOFT":msg.b.dg[2],
                "DESCARGA_SOL1":msg.b.dg[3],
                "DESCARGA_SOL2":msg.b.dg[4],
                "DESCARGA_SOL3":msg.b.dg[5],
                "DESCARGA_SOL4":msg.b.dg[6],
                "MEDICION_EA1":msg.b.dg[7],
                "MEDICION_EA2":msg.b.dg[8],
                "PUBLISH":msg.b.dg[9],
                "INCONSISTENCIA_RESET_HARD":msg.b.dg[10]
                },
                "UTC": string2UTC(msg.b.ti)
            }
        } 
        return JSON.stringify(result);
    }
    catch(err) {
        result = {
            error : err.message
        }
        return result;
    }   
  }
  ​
  function number2OnOff(number){
    if (parseInt(number) == 0){
        return 'Off';
    } else {
        return 'On';
    }
  }
  ​
  ​
  /**
  *  
  * CONVERT TO UTC:
  * 
  *  Input format 'J DD/MM/YY HH:MM:SS'
  * 
  * @param {*} str 
  */
  function string2UTC(str){
    var splitDate = str.split(" ");
    var date=splitDate[1].split("/");
    var time=splitDate[2].split(":");
  ​
    date = new Date(Date.UTC(20+date[2],date[1]-1,date[0],time[0]-2,time[1],time[2],0)); 
      
    return date.getTime({timeZone : 'Europe/Madrid'})/1000;
  }
