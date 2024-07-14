import CardSection from '@/components/CardSection';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { getUsers } from '../actions/getUsers';

jest.mock('../actions/getUsers', () => ({
    getUsers : jest.fn(),
}));

jest.mock('../components/Avatar', () => ({ Avatar: () => 'Avatar' }));

describe('Page Component Tests', () => {

    const MOCK_USERS = {users : [{
        rank : 1,
        address : '123',
        avatarCid : 'abc',
        username : 'testuser.eth',
        gmStreak : 10,
        xp : 10,
        level : 10
    },
    {
        rank : 2,
        address : '0099',
        avatarCid : 'jii',
        username : 'anotherUser.eth',
        gmStreak : 10,
        xp : 10,
        level : 10
    }
]};

    it('renders a card with a user', async() => {
        //@ts-ignore mock only exists at runtime
        getUsers.mockImplementation(()=> MOCK_USERS);
        render(await CardSection());
        MOCK_USERS.users.forEach((user)=>{
            expect(screen.getByText(user.username)).toBeInTheDocument();
        })
    })
})