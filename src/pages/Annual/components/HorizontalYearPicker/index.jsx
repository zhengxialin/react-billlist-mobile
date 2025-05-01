import {useRef, useState, useEffect} from 'react'
import './index.css'

export default function HorizontalYearPicker({startYear, endYear, uploadYear}) {

    const ey = window.innerWidth < 385 ? 1 : 2
    const years = Array.from({length:endYear-startYear+3+ey},(_,i)=>startYear+i-ey)

    const yearListRef = useRef(null)
    const [pickedYear, setPickedYear] = useState(null)
    const [transX, setTransX] = useState(0)

    const timeoutRef = useRef(null)
    const handleScroll = (e) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        let xValue = e.target.offsetWidth/2 + e.target.scrollLeft
        let xIndex = Math.floor((xValue - 30)/90)
        let xShift = Math.floor(((xValue-30)/90)%1*90-73)
        setPickedYear(years[xIndex])
        setTransX(xShift)
        uploadYear(years[xIndex])
      }, 100);
    }

    useEffect(() => {
      if(yearListRef.current)
        {yearListRef.current.scrollLeft=1}
    }, []);

  return (
    <>
      {/* The following div is for x axis calibration */}
      {/* <div className="vertical-line"></div> */}

      <div>
        <div > 
          <div className='leftMask'></div>
          <div className='rightMask'></div>
            <ul className='yearList' 
                ref={yearListRef} 
                onScroll={handleScroll} 
                style={{transform: `translateX(${transX}px)`,
                transition: "transform 0.5s ease-out"}}
                >
                  {years.map(year=>
                  <li 
                    key={year} 
                    className='yearListItem' 
                    onClick={()=>{year >= startYear && year <= endYear && (uploadYear(year), setPickedYear(year))}}
                    style={{
                      fontWeight: year === pickedYear && 'bold',
                      color: year === pickedYear && '#1d9599',
                    }}
                    >{year}</li>)}
            </ul>

        </div>
      </div>
    </>
  )
}
