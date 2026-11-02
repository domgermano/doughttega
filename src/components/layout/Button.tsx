import styled from "styled-components";
import type { DefaultTheme } from "styled-components";

type Colors = keyof DefaultTheme["colors"];

const Button = styled.button<{ $color?: Colors }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[3]} ${(p) => p.theme.space[5]};
  height: 44px;
  background: transparent;
  border: 2px solid ${(p) => p.theme.colors[p.$color ?? "mustard"]};
  border-radius: 100px;
  color: ${(p) => p.theme.colors[p.$color ?? "mustard"]};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.type.bodyMStrong.size};
  font-weight: ${(p) => p.theme.type.bodyMStrong.weight};
  line-height: ${(p) => p.theme.type.bodyMStrong.leading};
  letter-spacing: ${(p) => p.theme.type.bodyMStrong.tracking};
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.1s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(${(p) => p.theme.space[1]});
  }
`;

export default Button;
