import React from "react"

const Review = (props) =>{

    return(
        <>
        {props.reviews
            ? props.reviews.length > 0
                ? props.reviews.reverse().map((item,index) => (
                    <div key={`d-${index}`}>
                        <hr/>
                            <div>
                                <div>{item.review}</div>
                                <div style={{ display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                    <div style={{width:'30%',marginRight:20}}><text style={{fontStyle:'italic',color:'gray',opacity:0.8}}>{item.date}</text></div>
                                </div>
                            </div>
                        <hr/>
                    </div>
                    ))
                :<div>리뷰가 없습니다.</div>
            :<div>선택된 음식점이 없습니다 음식점을 선택해주세요.</div>
        }
        </>
    )
}
export default Review;