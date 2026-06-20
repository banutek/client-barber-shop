import React from 'react'

export interface IBaseProps {
  default_method?: () => void
  default_props?: boolean
}

export const BasePage: React.FC<IBaseProps> = () => {
  // const navigate = useNavigate()
  return (
    <div>
      hello world from base page
      {/* <div onClick={() => navigate('/')}>Go to home</div> */}
    </div>
  )
}
