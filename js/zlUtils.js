function stringToU8Buffer(inString)
{
  const strLen=inString.length;
  var buf = new Uint8Array(strLen); // 1 byte for each char - only works for regular ascii
  var cnt=0;
  for (cnt=0;  cnt < strLen; cnt++) 
  {
    buf[cnt] = inString.charCodeAt(cnt);
  }
  buf[cnt]=0;
  
  return buf;
}

function u8BufToString(inU8Buf)
{
  const retStr = String.fromCharCode.apply(null, new Uint8Array(inU8Buf)); 
  return retStr;
}
