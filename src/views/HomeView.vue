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
  z-index: 0; /* 确保蒙版层在背景图片和其他内容之间 */
}

.rectangle {
  width: 1000px;
  height: 120px;
  border: 2px solid #ffffff;
  margin: 20px;
  position: absolute; /* 使用 absolute 来让矩形框和文本独立 */
  z-index: 1; /* 确保矩形框在蒙版和背景图片上面 */
}

.rectangle-1 {
  top: 58%;
  left: 48%;
  transform: translateX(-50%);
}

.rectangle-2 {
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
}

.text {
  font-size: 24px;
  color: #ffffff; /* 文本颜色改为白色，确保在背景图片上可见 */
  font-weight: bold;
  text-align: center;
  position: absolute;
  width: 800px;
  top: 30%; /* 根据需要调整文本的垂直位置 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2; /* 确保文本在蒙版层和矩形框之上 */

}

.text-1 {
  font-size: 140px;
  width: 2000px;
  top: 20%; /* 调整文本的位置，避免与矩形框重叠 */
}

.text-2 {
  font-size: 20px;
  top: 66%; /* 同样调整第二个文本的位置 */
}
</style>
