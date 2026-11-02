import styled, { css } from 'styled-components'
import type { Theme } from '../../styles/theme'

type Skin = keyof Theme['type']

interface TextProps {
  skin: Skin
  as?: React.ElementType
  uppercase?: boolean
  className?: string
  children?: React.ReactNode
}

interface StyledProps {
  $skin: Skin
  $uppercase?: boolean
}

const headingSkins = new Set<Skin>([
  'displayXl', 'displayL', 'displayM',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
])

const StyledText = styled.span<StyledProps>`
  ${(p) => {
    const t = p.theme.type[p.$skin]
    const isHeading = headingSkins.has(p.$skin)
    return css`
      font-family: ${isHeading ? p.theme.fonts.heading : p.theme.fonts.body};
      font-size: ${t.size};
      font-weight: ${t.weight};
      line-height: ${t.leading};
      letter-spacing: ${t.tracking};
      ${p.$uppercase ? 'text-transform: uppercase;' : ''}
    `
  }}
`

function Text({ skin, as, uppercase, className, children }: TextProps) {
  return (
    <StyledText $skin={skin} $uppercase={uppercase} as={as} className={className}>
      {children}
    </StyledText>
  )
}

export default Text
