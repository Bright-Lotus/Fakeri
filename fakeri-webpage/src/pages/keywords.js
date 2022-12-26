import Elite from '../images/Elite.png';
import LastBreath from '../images/LastBreath.png';
import Fast from '../images/Fast.png'
import Hardened from '../images/Hardened.png'
import Vampiric from '../images/Vampiric.png'
import FlameTouch from '../images/FlameTouch.png'
import PoisonousAttacks from '../images/PoisonousAttacks.png'
import Plasmatic from '../images/Plasmatic.png'
import Duelist from '../images/Duelist.png'
import Elusive from '../images/Elusive.png'


import { Container, Card, Col, Row, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function Keywords() {
    const keyword = useLocation().pathname.split('/')[2];
    console.log(keyword)
    const data = {
        name: 'Keywords',
        desc: '',
        logo: '',
    }

    const navigate = useNavigate();

    const handleClick = (event, category) => {
        navigate(`/keywords/${category.toLowerCase()}`);
    }

    const keywordLogo = (keyword) => {
        switch (keyword) {
            case 'Elite':
                return Elite

            case 'Last Breath':
                return LastBreath

            case 'Fast':
                return Fast

            case 'Hardened':
                return Hardened;
            
            case 'Vampiric':
                return Vampiric;

            case 'Flame Touch': return FlameTouch;
            case 'Poisonous Attacks': return PoisonousAttacks;
            case 'Plasmatic': return Plasmatic;
            case 'Duelist': return Duelist;
            case 'Elusive': return Elusive;

            default:
                break;
        }
    }

    switch (keyword) {
        case 'elite': {
            data.name = 'Elite';
            data.desc = <>
            <p style={{ color: 'black', fontFamily: 'Burbank Big' }}>
                Esta unidad recibe una bonificacion en una stat aleatoria. <br />
                No puedes ver ninguna de sus propiedades hasta que empieces una batalla con esta unidad. <br /><hr />

                Esta unidad tambien hace daño bonus cada cierta cantidad de ataques. <br />
                Estos ataques siguen un patron.
            </p>
            <Card.Footer><Button onClick={_ => (navigate('/keywords'))}>Volver</Button></Card.Footer>
            </>
            data.logo = Elite;
            break;
        }

        default:
            break;
    }
    return (
        <div className="App">
            <header className="App-header">
                <Container>
                    <Card>
                        <Card.Header><p style={{ color: 'black', fontFamily: 'Burbank Big', marginBottom: 0, fontSize: '40px' }}>{data.name} {(data.logo === '') ? <></> : <img src={data.logo} alt="keyword-badge" style={{ width: '34px !important'}}/>}</p></Card.Header>
                        <Card.Body>
                            {(data.desc === '') ? <Row xs={1} md={2} className="g-4" style={{ overflowY: 'scroll', height: '550px' }}>
                                {['Elite', 'Hardened', 'Elusive', 'Flame Touch', 'Poisonous Attacks', 'Plasmatic', 'Vampiric', 'Duelist', 'Last Breath', 'Fast']
                                    .map((category, idx) => (
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title><p style={{ color: 'black' }}>{category} <img src={keywordLogo(category)} width={32} height={32} alt="elite-badge" /></p></Card.Title>
                                                    <Card.Text>
                                                        <p style={{ color: 'black' }}>See the information of {category}</p>
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer><Button onClick={event => { handleClick(event, category) }}>Go!</Button></Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                            </Row> : data.desc}
                        </Card.Body>
                    </Card>
                </Container>
            </header>
        </div>
    )
}