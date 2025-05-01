export default function Icon({type}) {
  return (
    <img
        src={`https://raw.githubusercontent.com/zhengxialin/image-storage/main/assets/icon/${type}.png`}
        alt="icon"
        style={{width:20, height: 20}}
    />
  )
}
