import { builder, BuilderComponent } from '@builder.io/react'

builder.init(process.env.BUILDERIO_API_KEY)

const Review = (props) => (
  <BuilderComponent
    content={props.content}
    model="page" />
)

export default Review;

Review.getInitialProps = async ({pathname}) => {
  const content = await builder.get('page', { url: pathname }).promise();
  return {
    content,
  }
}