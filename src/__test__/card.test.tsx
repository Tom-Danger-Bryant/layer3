import Card  from '@/components/Card';
import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'


describe('Card Component Tests', () => {

    const MOCK_USER = {
        rank : 1,
        address : '123',
        avatarCid : 'abc',
        username : 'testuser.eth',
        gmStreak : 10,
        xp : 10,
        level : 10
    }

    it('renders a card with a user', async() => {
        render(<Card user={MOCK_USER}/>);
        expect(screen.getByText(MOCK_USER.username)).toBeInTheDocument();
    })
})