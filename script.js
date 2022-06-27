'use strict'
{
  const num_bth = document.querySelectorAll('.num_bth');
  let output_sub = document.getElementById('output_sub');
  const output_total = document.getElementById('output_total');
  let total = 0; 
  let state = 'start';
  let mode = 'integer_mode'; 

    const one_nine = document.querySelectorAll('.one_nine');
    one_nine.forEach(index => {     
      index.addEventListener('click', () => {
        if(state === 'start') {
          //最初totalに打った数字を代入する
          total = index.dataset.indexId;         
        }else if(state === 'finish') {
          //計算後は、リセット処理後に、totalに打った数字を代入する
          reset();
          total = index.dataset.indexId;  
        }else if(state === 'calculation'||state === 'calBtn'){
          //計算中totalに打った数字を追加して、totalに代入する。
          total += index.dataset.indexId;
        }     
        output_sub.textContent = total;
        state = 'calculation'//数字を入力している状態にする。
        changeOutput()//計算結果・計算過程画面の入れ替える
      }) //click   
    })//forEach

  // 0の数字ボタンを押した時
  const zero = document.getElementById('zero');
  zero.addEventListener('click', () => {
//    - 最初state==='start
//    - 計算終了後state==='finish'
//    - 演算記号入力直後state==='calBtn'の時、
//    前の文字が0の時は0が入力できないようにする。
  if(state==='start'||state==='finish'||state==='calBtn'){
      if(output_sub.textContent.slice(-1) === '0') {
        //sliceで切り出されたのは0ではなく'0'
        console.log('前の文字はゼロ');
        return;
      }
    }

    if(state==='start') {
      total = zero.dataset.indexId;  
    }else{
      total += zero.dataset.indexId;
    }      
    output_sub.textContent = total;
    changeOutput()//計算結果・計算過程画面の入れ替える
//    state = 'calculation'//数字を入力している状態にする。
  }) //click    

  // 「.」小数点ボタンを押した時
  const point = document.getElementById('point');
  point.addEventListener('click', () => {
    console.log(point.dataset.indexId)
    if(mode === 'decimal_mode'){
      return; //小数点入力モードではもう一度小数点を押せない
       }      
    //「.4」と入力したら0.4としたい。(1)+(2)で0.4となる
    if(state==='start'||state==='finish') {
      total = 0;//(1)最初と計算終了直後なら、0を入力
    }else if(state==='calBtn'){
      //これを入れないと、0.4+0.4と打つと0.4+00.4となる。
      if(output_sub.textContent.slice(-1)!=='0'){
        total += 0;//(1')演算記号入力直後なら、今までの計算結果に0を入力
      }   
    }
    total += point.dataset.indexId;//(2)「.」を入力

    output_sub.textContent = total;
    state = 'calculation'//数字を入力している状態にする。
    mode = 'decimal_mode'; //小数入力モードに変更
    changeOutput()//計算結果・計算過程画面の入れ替える
  }) //click  

  //「＋　÷　－　×」ボタンを押した時
  const cal = document.querySelectorAll('.cal');
  cal.forEach(index => {     
    index.addEventListener('click', () => {
      if(state === 'start') {
        return;//最初記号は押せない
      }else if(state === 'calculation'){
        total += index.dataset.indexId;//計算中はtotalに打った記号を追加し、totalに代入する。
      }else if(state === 'finish'){
        //計算後は前の計算結果をtotal に代入して計算しなおす。
        total = output_total.textContent;
        total += index.dataset.indexId;
        output_total.textContent = 0
      }else if(state ==='calBtn') {
        // 演算記号入力状態state = 'calBtn'の時に、演算記号を押したら、totalの最後の一文字（演算記号）を削除し、新たに押した演算記号を追加する。
//        →totalに、totalの最初から最後から二文字目までを代入する（最後の一文字を削除する）
        total = total.slice(0, -1)
        total += index.dataset.indexId;
      }

      output_sub.textContent = total;
      state = 'calBtn'//演算記号を入力している状態する。
      mode ='integer_mode'//整数モードに戻す
      changeOutput()//計算結果・計算過程画面の入れ替える
    }) //click   
  })//forEach

  //イコールを押した時
  const equal_btn = document.getElementById('equal_btn');
  equal_btn.addEventListener('click',() =>{
    console.log(eval(total));
    output_total.textContent = digitNum(eval(total));//桁数を揃える関数10桁を表示させる関数digitNum
    state = 'finish'//計算が終わった状態にする。
    mode ='integer_mode'//整数モードに戻す
    changeOutput()//計算結果・計算過程画面の入れ替える
  });

  //Cボタン（リセットボタン）を押した時の処理
  const clear = document.getElementById('clear')
  clear.addEventListener('click', () => {
    reset();
  })

 //リセットを行う関数
  function reset() {
    total = 0; 
    output_sub.textContent = 0;
    output_total.textContent = 0;
    mode ='integer_mode'//整数モードに戻す
    state ='start';
    changeOutput()//計算結果・計算過程画面の入れ替える
  }
  const bs = document.getElementById('bs')
  bs.addEventListener('click', () => {
    if(state ==='finish') {
      return;
    }

    total = output_sub.textContent.slice(0, -1);
    output_sub.textContent = total;

    let lastWord = output_sub.textContent.slice(-1)
    if(lastWord==='+'||lastWord==='-'||lastWord==='*'||lastWord==='/') {

      state = 'calBtn'
    }else if(lastWord==='') {

      state = 'start';
    }    
  });


  function digitNum(num) {
    return Math.round(num*100000000)/100000000;
  }

  
  function changeOutput(){
    if(state==='finish'){
      output_total.classList.add('active');
      output_sub.classList.remove('active');   
    }else{
      output_sub.classList.add('active');
      output_total.classList.remove('active'); 
    } 
  }

}