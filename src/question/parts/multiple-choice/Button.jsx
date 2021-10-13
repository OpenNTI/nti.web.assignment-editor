
import Part from '../../../editor/input-types/multiple-choice/';
import Button from '../components/Buttons';

export default function MultipleChoiceButton(props) {
	return <Button {...props} part={Part.getBlankPart()} />;
}
