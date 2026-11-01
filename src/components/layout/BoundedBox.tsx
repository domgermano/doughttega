import styled from 'styled-components'

const BoundedBox = styled.div`
  max-width: 1280px;
  padding-inline: ${p => p.theme.space[6]};
  margin-inline: auto;
  width: 100%;
`

export default BoundedBox
