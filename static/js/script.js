// #FFA500                     #0f0
// rgba(255, 165, 0, 0.75)     rgba(0, 150, 0, 0.75)
// #ffcf76                     #76ff76
// #140d00                     #001400
// rgba(255, 165, 0, 0.2)      rgba(0, 255, 0, 0.2)


// #ff7b00
// rgba(255,123,0, 0.75)
// #ffb876
// #140900
// rgba(255,123,0, 0.2)

$(document).ready(function() {
  $("pre, h1").click(function() {
    blip();
    $("body").toggleClass("body-orange");
    $("#terminal").toggleClass("term-orange");
    $(".model-green").toggleClass("model-orange");
    $(".input-conf").toggleClass("input-conf-orange");
    $(".input-green").toggleClass("input-orange");
    $(".button-green").toggleClass("button-orange");
    $("::selection").toggleClass("body-orange");
    $(".input-conf::-webkit-slider-thumb").toggleClass("input-conf-orange::-webkit-slider-thumb");
    $(".input-conf::-moz-range-thumb").toggleClass("input-conf-orange::-moz-range-thumb");
    
  });
});

function blip() {
  let audio = new Audio('static/sounds/blip.mp3');
  audio.play();
}

function playClick() {
  let audio = new Audio('static/sounds/click.mp3');
  audio.play();
}

function tokensPrice(input_tokens, output_tokens) {
  let tokenIn = 0;
  let tokenOut = 0;
  switch (model) {
    case 'gpt-4-turbo-preview':
      tokenIn = 0.01;
      tokenOut = 0.03;
      break;
    case 'gpt-4':
      tokenIn = 0.03;
      tokenOut = 0.06;
      break;
    case 'gpt-3.5-turbo':
      tokenIn = 0.0005;
      tokenOut = 0.0015;
      break;
    case 'gpt-3.5-turbo-instruct':
      tokenIn = 0.0015;
      tokenOut = 0.0020;
      break;
    default:
      tokenIn = 0;
      tokenOut = 0;
      break;
  }
  const totalUSD = (input_tokens * tokenIn + output_tokens * tokenOut) / 1000;
  return totalUSD.toFixed(8);
}

function typeWriterEffect(messages) {
  const typed_message = document.querySelector(".typed-message");
  let i = 0;
  let audio = new Audio('static/sounds/computer-processing.mp3');
  audio.loop = true;

  function toggleCursor() {
    const cursor = typed_message.querySelector(".cursor");
    if (cursor) {
      cursor.classList.toggle("cursor-on");
    }
  }

  setTimeout(() => {
    setInterval(toggleCursor, 1000);
    typeWriter();
  }, 1);

  function typeWriter() {
    if (i < messages.length) {
      let text = "";
      if (i == 0) {
        text = ip + "@Mistral-87:~$ ";
      }
      if (i == 1) {
        text = "root@Mistral-87:~# ";
      }
      const currentMessage = messages[i]["content"];
      const speed = 25 * Math.random() + 25;
      let j = 0;
      typed_message.innerHTML = text;
      const typeInterval = setInterval(() => {
        if (j < currentMessage.length) {
          typed_message.innerHTML += currentMessage.charAt(j);
          j++;
        } else {
          clearInterval(typeInterval);
          i++;
          typed_message.insertAdjacentHTML(
            "beforeend",
            '<span class="cursor">▋</span>'
          );
          setTimeout(typeWriter, 1000);
        }
      }, speed);
    } else {
        audio.pause();
        audio.currentTime = 0;
        typed_message.scrollIntoView({behavior: "smooth"});
      }
  }
  audio.play();
}