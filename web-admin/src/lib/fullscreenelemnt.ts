export default function expandToFullScreen(elemt: any) {
  const fullScreenDiv = elemt;
  if (fullScreenDiv.requestFullscreen) {
    fullScreenDiv.requestFullscreen();
  } else if (fullScreenDiv.mozRequestFullScreen) {
    // Firefox
    fullScreenDiv.mozRequestFullScreen();
  } else if (fullScreenDiv.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    fullScreenDiv.webkitRequestFullscreen();
  } else if (fullScreenDiv.msRequestFullscreen) {
    // IE/Edge
    fullScreenDiv.msRequestFullscreen();
  }
}

export function exitFullScreen(elemt: any) {
  const document = elemt;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  }
}
