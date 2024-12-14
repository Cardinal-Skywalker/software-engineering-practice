<template>
  <div class="home-view">
    <!-- 背景图片和蒙版 -->
    <div class="background-image">
      <!-- 矩形框 1 -->
      <div class="rectangle rectangle-1"></div>
      <!-- 文本 1 -->
      <p class="text text-1">NJU-Tech 让教学更轻松</p>

      <!-- 矩形框 2 -->
      <div class="rectangle rectangle-2"></div>
      <!-- 文本 2 -->
      <p class="text text-2">为教师提供高效的教学支持，助力每一位教师在教育教学中更好地发挥自己的优势和潜力</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

<style scoped>
.home-view {
  position: relative;
  width: 100%;
  height: 100vh;
}

.background-image {
  position: relative;
  background-image: url('../assets/Home_BackGround.png');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.background-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑色蒙版 */
  z-index: 0;
}

.rectangle {
  width: 1000px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  margin: 20px;
  position: absolute;
  z-index: 1;
  border-radius: 10px; /* 圆角矩形框 */
  background-color: rgba(255, 255, 255, 0.3); /* 背景透明 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0; /* 初始设置为透明 */
  animation: fadeIn 2s forwards; /* 渐显动画 */
}

.rectangle-1 {
  top: 58%;
  left: 48%;
  transform: translateX(-50%);
  animation-delay: 1s; /* 延迟1秒开始渐显 */
}

.rectangle-2 {
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.5s; /* 延迟1.5秒开始渐显 */
}

.text {
  font-size: 24px;
  color: #ffffff; /* 白色文本 */
  font-weight: bold;
  text-align: center;
  position: absolute;
  width: 800px;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7); /* 添加文本阴影 */
}

.text-1 {
  font-size: 140px;
  width: 2000px;
  top: 20%;
  white-space: nowrap; /* 确保文本不换行 */
  overflow: hidden; /* 隐藏超出区域 */
  border-right: 4px solid #fff; /* 添加打字光标效果 */
  animation: typing 4s steps(30) 1s 1 normal both, blink 0.75s step-end infinite; /* 打字动画 */
}

.text-2 {
  font-size: 20px;
  top: 66%; /* 保持原位置 */
  opacity: 0; /* 初始设置为透明 */
  animation: fadeIn 2s forwards; /* 渐显动画 */
  animation-delay: 2s; /* 延迟2秒开始渐显 */
}

@keyframes typing {
  from {
    width: 0; /* 从0宽度开始 */
  }
  to {
    width: 100%; /* 到100%宽度完成 */
  }
}

@keyframes blink {
  50% {
    border-color: transparent; /* 光标闪烁 */
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0; /* 开始时透明 */
  }
  100% {
    opacity: 1; /* 完成时不透明 */
  }
}

@media (max-width: 768px) {
  .rectangle {
    width: 80%;
    height: 100px;
  }

  .text {
    font-size: 18px;
    width: 90%;
  }

  .text-1 {
    font-size: 36px;
    top: 15%;
  }

  .text-2 {
    font-size: 16px;
    top: 60%;
  }
}
</style>
